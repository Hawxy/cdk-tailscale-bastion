import { App, Stack } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { TailscaleBastion } from '../src';

const mockApp = new App();
const env = { region: 'ap-southeast-2' };
const stack = new Stack(mockApp, 'MyStack', { env });

const vpc = new Vpc(stack, 'MyVpc');

const secret = Secret.fromSecretNameV2(stack, 'ApiSecrets', 'tailscale');

new TailscaleBastion(stack, 'Test-Bastion', {
  vpc: vpc,
  tailscaleCredentials: {
    secretsManager: {
      secret: secret,
      key: 'AUTH_KEY',
    },
  },
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
              command: 'mkdir -p /etc/systemd/resolved.conf.d',
            },
            '004': {
              command: 'ln -sf /dev/null /etc/systemd/resolved.conf.d/resolved-disable-stub-listener.conf',
            },
            '005': {
              command: 'ln -sf /run/systemd/resolve/stub-resolv.conf /etc/resolv.conf',
            },
            '006': {
              command: 'dnf config-manager --add-repo https://pkgs.tailscale.com/stable/amazon-linux/2023/tailscale.repo',
            },
            '007': {
              command: 'sleep 10',
            },
            '008': {
              command: 'dnf -y install jq',
            },
            '009': {
              command: 'dnf -y install tailscale',
            },
            '010': {
              command: 'systemctl enable --now tailscaled',
            },
            '011': {
              command: {
                'Fn::Join': [
                  '',
                  [
                    'echo TS_AUTHKEY=$(aws secretsmanager get-secret-value --region ap-southeast-2 --secret-id arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':secretsmanager:ap-southeast-2:',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    ":secret:tailscale --query SecretString --output text | jq '.\"AUTH_KEY\"') >> /etc/environment",
                  ],
                ],
              },
            },
            '012': {
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

  template.hasOutput('*', {
    Value: 'ap-southeast-2.compute.internal',
  });
});


