import { CfnOutput, Fn, SecretValue } from 'aws-cdk-lib';
import { BastionHostLinux, CloudFormationInit, InitCommand, ISecurityGroup, Peer, Port, SubnetSelection, Vpc, InstanceType, SubnetType } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export interface TailscaleBastionProps {
  /**
  * Auth key generated from Tailscale. Do not store this key with your source code.
  * Ephemeral keys are recommended.
  */
  readonly tailScaleAuthKey: SecretValue;
  /**
    * VPC to launch the instance in.
    */
  readonly vpc: Vpc;
  /**
   * In which AZ to place the instance within the VPC.
   *
   * @default - Random zone.
   */
  readonly availabilityZone?: string;
  /**
   * The name of the instance.
   *
   * @default 'BastionHost'
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
}

export class TailscaleBastion extends Construct {
  readonly bastion: BastionHostLinux;
  constructor(scope: Construct, id: string, props: TailscaleBastionProps) {
    super(scope, id);

    const { vpc, availabilityZone, instanceName, subnetSelection, securityGroup, instanceType } = props;


    const bastion = new BastionHostLinux(this, 'BastionHost', {
      vpc,
      availabilityZone,
      instanceName,
      securityGroup,
      instanceType,
      subnetSelection: subnetSelection ?? { subnetType: SubnetType.PUBLIC },
      init: CloudFormationInit.fromElements(
        InitCommand.shellCommand('echo \'net.ipv4.ip_forward = 1\' | sudo tee -a /etc/sysctl.conf'),
        InitCommand.shellCommand('echo \'net.ipv6.conf.all.forwarding = 1\' | sudo tee -a /etc/sysctl.conf'),
        InitCommand.shellCommand('sudo sysctl -p /etc/sysctl.conf'),
        InitCommand.shellCommand('yum-config-manager --add-repo https://pkgs.tailscale.com/stable/amazon-linux/2/tailscale.repo'),
        InitCommand.shellCommand('yum -y install tailscale'),
        InitCommand.shellCommand('systemctl enable --now tailscaled'),
        InitCommand.shellCommand(`tailscale up --authkey ${props.tailScaleAuthKey} --advertise-routes=${props.vpc.vpcCidrBlock} --accept-dns=false`),
      ),
    });

    bastion.connections.allowFromAnyIpv4(Port.udp(41641));
    bastion.connections.allowFrom(Peer.anyIpv6(), Port.udp(41641));

    const splitAddress = Fn.split('/', props.vpc.vpcCidrBlock, 2)[0];
    const splitIp = Fn.split('.', splitAddress, 4);
    const dnsServer = `${splitIp[0]}.${splitIp[1]}.${splitIp[2]}.2`;

    new CfnOutput(this, 'Vpc-Dns', { exportName: 'TailscaleDnsNameserver', value: dnsServer });
    new CfnOutput(this, 'Vpc-Dns-Domain', { exportName: 'TailscaleDnsDomain', value: 'compute.internal' });

    this.bastion = bastion;

  }
}