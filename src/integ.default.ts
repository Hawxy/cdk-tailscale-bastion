import * as cdk from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { TailscaleBastion } from './index';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'MyStack');

const vpc = new Vpc(stack, 'MyVpc');

const tsAuthKey = stack.node.tryGetContext('tsAuthKey') as string | undefined;

if (!tsAuthKey) {
  throw new Error('Tailscale auth key must be declared to deploy this stack. Set it with --context tsAuthKey=tsauth-1234');
}

new TailscaleBastion(stack, 'Cdk-Sample-Lib', {
  vpc,
  tailScaleAuthKey: tsAuthKey,
});