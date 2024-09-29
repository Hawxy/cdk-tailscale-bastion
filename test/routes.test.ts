import { App, Stack } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { TailscaleBastion } from '../src';

const mockApp = new App();

const stack = new Stack(mockApp, 'MyStack');

const vpc = new Vpc(stack, 'MyVpc');

const secret = Secret.fromSecretNameV2(stack, 'ApiSecrets', 'tailscale');

const bastion = new TailscaleBastion(stack, 'Test-Bastion', {
  vpc: vpc,
  tailscaleCredentials: {
    secretsManager: {
      secret: secret,
      key: 'AUTH_KEY',
    },
  },
  incomingRoutes: [
    '192.168.1.0/24',
  ],
  advertiseRoute: 'fd7a:115c:a1e0:b1a:0:7:a01:100/120',
});

secret.grantRead(bastion.bastion);

const template = Template.fromStack(stack);

test('Bastion host should have routing set up', () => {
  template.resourceCountIs('AWS::EC2::Instance', 1);
  template.resourceCountIs('AWS::EC2::Route', 6);

  template.hasResourceProperties('AWS::EC2::Route', {
    RouteTableId: {
      Ref: Match.stringLikeRegexp('MyVpcPrivateSubnet1RouteTable'),
    },
    DestinationCidrBlock: '192.168.1.0/24',
    InstanceId: {
      Ref: Match.stringLikeRegexp('BastionHost'),
    },
  });

  template.hasResource('AWS::EC2::Instance', {
    Metadata: {
      'AWS::CloudFormation::Init': {
        config: {
          commands: {
            '010': {
              command: 'source /etc/environment && tailscale up --authkey $TS_AUTHKEY --advertise-routes=fd7a:115c:a1e0:b1a:0:7:a01:100/120 --accept-routes --accept-dns=false',
            },
          },
        },
      },
    },
  });

});


