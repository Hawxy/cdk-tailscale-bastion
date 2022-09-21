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
});

secret.grantRead(bastion.bastion);

const template = Template.fromStack(stack);

test('Bastion host should be created', () => {
  template.resourceCountIs('AWS::EC2::Instance', 1);
  template.hasResourceProperties('AWS::EC2::Instance', {
    InstanceType: 't3.nano',
    Tags: [
      {
        Key: 'Name',
        Value: 'BastionHostTailscale',
      },
    ],
  });

  template.hasResource('AWS::EC2::Instance', {
    Metadata: {
      'AWS::CloudFormation::Init': {
        configSets: {
          default: [
            'config',
          ],
        },
        config: {
          commands: {
            '000': {
              command: "echo 'net.ipv4.ip_forward = 1' | sudo tee -a /etc/sysctl.conf",
            },
            '001': {
              command: "echo 'net.ipv6.conf.all.forwarding = 1' | sudo tee -a /etc/sysctl.conf",
            },
            '002': {
              command: 'sudo sysctl -p /etc/sysctl.conf',
            },
            '003': {
              command: 'yum-config-manager --add-repo https://pkgs.tailscale.com/stable/amazon-linux/2/tailscale.repo',
            },
            '004': {
              command: 'yum -y install tailscale',
            },
            '005': {
              command: 'yum -y install jq',
            },
            '006': {
              command: 'systemctl enable --now tailscaled',
            },
            '007': {
              command: {
                'Fn::Join': [
                  '',
                  [
                    'echo TS_AUTHKEY=$(aws secretsmanager get-secret-value --region ',
                    {
                      Ref: 'AWS::Region',
                    },
                    ' --secret-id arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':secretsmanager:',
                    {
                      Ref: 'AWS::Region',
                    },
                    ':',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    ":secret:tailscale --query SecretString --output text | jq '.\"AUTH_KEY\"') >> /etc/environment",
                  ],
                ],
              },
            },
            '008': {
              command: {
                'Fn::Join': [
                  '',
                  [
                    'source /etc/environment && tailscale up --authkey $TS_AUTHKEY --advertise-routes=',
                    {
                      'Fn::GetAtt': [
                        Match.stringLikeRegexp('MyVpc'),
                        'CidrBlock',
                      ],
                    },
                    ' --accept-routes --accept-dns=false',
                  ],
                ],
              },
            },
          },
        },
      },
    },
  });
});


