import { App, Stack } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { TailscaleBastion } from '../src';

const mockApp = new App();

const stack = new Stack(mockApp, 'MyStack');

const vpc = new Vpc(stack, 'MyVpc');

const secret = Secret.fromSecretNameV2(stack, 'ApiSecrets', 'tailscale').secretValueFromJson('AUTH_KEY');

new TailscaleBastion(stack, 'Test-Bastion', {
  vpc: vpc,
  tailScaleAuthKey: secret,
});

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
              command: 'systemctl enable --now tailscaled',
            },
            '006': {
              command: {
                'Fn::Join': [
                  '',
                  [
                    'tailscale up --authkey {{resolve:secretsmanager:arn:',
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
                    ':secret:tailscale:SecretString:AUTH_KEY::}} --advertise-routes=',
                    {
                      'Fn::GetAtt': [
                        Match.stringLikeRegexp('MyVpc'),
                        'CidrBlock',
                      ],
                    },
                    ' --accept-dns=false',
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


