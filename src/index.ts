import { CfnOutput, Fn, Stack, Token } from 'aws-cdk-lib';
import {
  AmazonLinuxCpuType,
  BastionHostLinux,
  CfnRoute,
  CloudFormationInit,
  InitCommand,
  InitElement,
  InstanceType,
  ISecurityGroup,
  IVpc,
  MachineImage,
  Peer,
  Port,
  SubnetSelection,
  SubnetType,
} from 'aws-cdk-lib/aws-ec2';
import { ISecret } from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

export interface SecretsManagerAuthKey {
  /**
  * Secret manager location where the tailscale auth key is stored. Must be in the standard key/value JSON format.
  */
  readonly secret: ISecret;
  /**
   * The key of the auth key value located within the provided secret.
   */
  readonly key: string;
}

export interface TailscaleCredentials {
  /**
   * Fetches the Auth Key from secrets manager. This value will be fetched during bastion startup.
   */
  readonly secretsManager?: SecretsManagerAuthKey;
  /**
   * Provides an auth key as a plaintext string.
   * This option will expose the auth key in your CDK template and should only be used with non-reusable keys.
   * Potentially useful for DevOps runbooks and temporary instances.
   * 
   * The `cachedInContext` configuration option might be relevant to you if you use this parameter.
   */
  readonly unsafeString?: string;
}

export interface TailscaleBastionProps {
  /**
    * VPC to launch the instance in.
    */
  readonly vpc: IVpc;
  /**
   * Credential settings for the tailscale auth key. One type must be used.
   * Ephemeral keys are recommended.
   */
  readonly tailscaleCredentials: TailscaleCredentials;
  /**
   * In which AZ to place the instance within the VPC.
   *
   * @default - Random zone.
   */
  readonly availabilityZone?: string;
  /**
   * The name of the instance.
   *
   * @default 'BastionHostTailscale'
   */
  readonly instanceName?: string;
  /**
   * Select the subnets to run the bastion host in.
   * PUBLIC subnets are used by default to allow for a direct Tailscale connection. DERP nodes will be used in a private subnet.
   *
   * @default - PUBLIC subnets of the supplied VPC
   */
  readonly subnetSelection?: SubnetSelection;
  /**
   * Security Group to assign to this instance.
   *
   * @default - create new security group with no inbound and all outbound traffic allowed
   */
  readonly securityGroup?: ISecurityGroup;
  /**
   * Type of instance to launch.
   *
   * @default 't3.nano'
   */
  readonly instanceType?: InstanceType;
  /**
   *  CPU Type of the instance.
   *
   *  @default AmazonLinuxCpuType.X86_64
   */
  readonly cpuType?: AmazonLinuxCpuType;
  /**
   * Additional cloudformation init actions to perform during startup.
   */
  readonly additionalInit?: InitElement[];
  /**
   * List of incoming routes from Tailscale network. VPC route table will get these targets added.
   *
   * @default none
   */
  readonly incomingRoutes?: string[];
  /**
   * Advertise a custom route instead of using the VPC CIDR, used for Tailscale 4via6 support.
   */
  readonly advertiseRoute?: string;
  /**
   * Setting this to true will result in the Amazon Linux AMI being cached in `cdk.context.json` and prevent the instance being replaced when the image is updated.
   * Enable this if you'd like to use non-reusable Tailscale keys, or you'd prefer the instance to remain stable.
   * Keep in mind that the AMI will grow old over time and is it your responsibility to evict it from the context.
   *
   * @default false
   */
  readonly cachedInContext?: boolean;
}

export class TailscaleBastion extends Construct {
  readonly bastion: BastionHostLinux;
  constructor(scope: Construct, id: string, props: TailscaleBastionProps) {
    super(scope, id);

    const {
      tailscaleCredentials,
      vpc,
      availabilityZone,
      instanceName,
      subnetSelection,
      securityGroup,
      instanceType,
      additionalInit,
      incomingRoutes,
      advertiseRoute,
      cpuType,
      cachedInContext,
    } = props;

    const authKeyCommand = this.computeTsKeyCli(tailscaleCredentials);

    const bastion = new BastionHostLinux(this, 'BastionHost', {
      vpc,
      availabilityZone,
      instanceName: instanceName ?? 'BastionHostTailscale',
      securityGroup,
      instanceType,
      machineImage: MachineImage.latestAmazonLinux2023({ cpuType: cpuType ?? AmazonLinuxCpuType.X86_64, cachedInContext: cachedInContext ?? false }),
      subnetSelection: subnetSelection ?? { subnetType: SubnetType.PUBLIC },
      init: CloudFormationInit.fromElements(
        // Configure IP forwarding
        InitCommand.shellCommand('echo \'net.ipv4.ip_forward = 1\' | sudo tee -a /etc/sysctl.conf'),
        InitCommand.shellCommand('echo \'net.ipv6.conf.all.forwarding = 1\' | sudo tee -a /etc/sysctl.conf'),
        InitCommand.shellCommand('sudo sysctl -p /etc/sysctl.conf'),

        // Configure Amazon Linux 2023 DNS https://github.com/tailscale/tailscale/issues/7816
        InitCommand.shellCommand('mkdir -p /etc/systemd/resolved.conf.d'),
        InitCommand.shellCommand('ln -sf /dev/null /etc/systemd/resolved.conf.d/resolved-disable-stub-listener.conf'),
        InitCommand.shellCommand('ln -sf /run/systemd/resolve/stub-resolv.conf /etc/resolv.conf'),

        // Install Tailscale
        InitCommand.shellCommand('dnf config-manager --add-repo https://pkgs.tailscale.com/stable/amazon-linux/2023/tailscale.repo'),
        // Protect against a potential conflict with AWS activity
        InitCommand.shellCommand('until dnf -y install tailscale ; do sleep 10s ; done'),
        InitCommand.shellCommand('systemctl enable --now tailscaled'),
        InitCommand.shellCommand(`echo TS_AUTHKEY=${authKeyCommand} >> /etc/environment`),
        InitCommand.shellCommand(`source /etc/environment && tailscale up --authkey $TS_AUTHKEY --advertise-routes=${advertiseRoute ?? vpc.vpcCidrBlock} --accept-routes --accept-dns=false`),
        ...(additionalInit ?? []),
      ),
      initOptions: {},
    });

    if (tailscaleCredentials.secretsManager) {
      tailscaleCredentials.secretsManager.secret.grantRead(bastion);
    }

    bastion.connections.allowFromAnyIpv4(Port.udp(41641), 'Tailscale IPv4');
    bastion.connections.allowFrom(Peer.anyIpv6(), Port.udp(41641), 'Tailscale IPv6');

    const splitAddress = Fn.split('/', props.vpc.vpcCidrBlock, 2)[0];
    const splitIp = Fn.split('.', splitAddress, 4);
    const dnsServer = `${splitIp[0]}.${splitIp[1]}.${splitIp[2]}.2`;

    new CfnOutput(this, 'Vpc-Dns-Nameserver', { value: dnsServer });

    const stack = Stack.of(this);
    const domain = Token.isUnresolved(stack.region) ? 'compute.internal' : `${stack.region}.compute.internal`;

    new CfnOutput(this, 'Vpc-Dns-Domain', { value: domain });

    for (const incomingRoute of incomingRoutes ?? []) {
      for (const subnet of vpc.privateSubnets) {
        new CfnRoute(subnet, `TailscaleRoute-${incomingRoute}`, {
          routeTableId: subnet.routeTable.routeTableId,
          destinationCidrBlock: incomingRoute,
          instanceId: bastion.instanceId,
        });
      }
    }

    this.bastion = bastion;

  }

  private computeTsKeyCli(credentials: TailscaleCredentials) {
    if (credentials.unsafeString) {
      return credentials.unsafeString;
    } else if (credentials.secretsManager) {
      const sm = credentials.secretsManager;
      return `$(aws secretsmanager get-secret-value --region ${sm.secret.env.region} --secret-id ${sm.secret.secretArn} --query SecretString --output text | jq '."${sm.key}"')`;
    } else {
      throw new Error('No Tailscale credentials set');
    }
  }
}