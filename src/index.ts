import { CfnOutput, Fn } from 'aws-cdk-lib';
import { BastionHostLinux, CloudFormationInit, InitCommand, ISecurityGroup, Peer, Port, SubnetSelection, Vpc, InstanceType, SubnetType, InitElement } from 'aws-cdk-lib/aws-ec2';
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
   */
  readonly unsafeString?: string;
}

export interface TailscaleBastionProps {
  /**
    * VPC to launch the instance in.
    */
  readonly vpc: Vpc;
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
   * Additional cloudformation init actions to perform during startup.
   */
  readonly additionalInit?: InitElement[];
}

export class TailscaleBastion extends Construct {
  readonly bastion: BastionHostLinux;
  constructor(scope: Construct, id: string, props: TailscaleBastionProps) {
    super(scope, id);

    const { tailscaleCredentials, vpc, availabilityZone, instanceName, subnetSelection, securityGroup, instanceType, additionalInit } = props;

    const authKeyCommand = this.computeTsKeyCli(tailscaleCredentials);

    const bastion = new BastionHostLinux(this, 'BastionHost', {
      vpc,
      availabilityZone,
      instanceName: instanceName ?? 'BastionHostTailscale',
      securityGroup,
      instanceType,
      subnetSelection: subnetSelection ?? { subnetType: SubnetType.PUBLIC },
      init: CloudFormationInit.fromElements(
        InitCommand.shellCommand('echo \'net.ipv4.ip_forward = 1\' | sudo tee -a /etc/sysctl.conf'),
        InitCommand.shellCommand('echo \'net.ipv6.conf.all.forwarding = 1\' | sudo tee -a /etc/sysctl.conf'),
        InitCommand.shellCommand('sudo sysctl -p /etc/sysctl.conf'),
        InitCommand.shellCommand('yum-config-manager --add-repo https://pkgs.tailscale.com/stable/amazon-linux/2/tailscale.repo'),
        InitCommand.shellCommand('yum -y install tailscale'),
        InitCommand.shellCommand('yum -y install jq'),
        InitCommand.shellCommand('systemctl enable --now tailscaled'),
        InitCommand.shellCommand(`echo TS_AUTHKEY=${authKeyCommand} >> /etc/environment`),
        InitCommand.shellCommand(`source /etc/environment && tailscale up --authkey $TS_AUTHKEY --advertise-routes=${props.vpc.vpcCidrBlock} --accept-dns=false`),
        ...(additionalInit ?? []),
      ),
    });

    if (props.tailscaleCredentials.secretsManager) {
      props.tailscaleCredentials.secretsManager.secret.grantRead(bastion);
    }

    bastion.connections.allowFromAnyIpv4(Port.udp(41641));
    bastion.connections.allowFrom(Peer.anyIpv6(), Port.udp(41641));

    const splitAddress = Fn.split('/', props.vpc.vpcCidrBlock, 2)[0];
    const splitIp = Fn.split('.', splitAddress, 4);
    const dnsServer = `${splitIp[0]}.${splitIp[1]}.${splitIp[2]}.2`;

    new CfnOutput(this, 'Vpc-Dns-Nameserver', { value: dnsServer });
    new CfnOutput(this, 'Vpc-Dns-Domain', { value: 'compute.internal' });

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