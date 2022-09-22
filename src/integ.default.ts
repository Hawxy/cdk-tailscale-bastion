import * as cdk from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { TailscaleBastion } from './index';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'MyStack');

const vpc = new Vpc(stack, 'MyVpc');

// Secrets Manager
const secret = Secret.fromSecretNameV2(stack, 'ApiSecrets', 'tailscale');

// Systems Manager Parameter Store
//const altSecret = SecretValue.ssmSecure('/tsauth');

new TailscaleBastion(stack, 'Cdk-Sample-Lib', {
  vpc,
  tailscaleCredentials: {
    secretsManager: {
      secret: secret,
      key: 'AUTH_KEY',
    },
  },
});
