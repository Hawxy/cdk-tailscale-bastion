# aws-cdk-tailscale-bastion

This packages creates an AWS Bastion configured for Tailscale.

You may find this package useful if you need high performance access to internal resources (ie RDS) without the overhead & limitations of Session Manager.

The Tailscale Auth key should be passed in via context or environment variable and NOT hardcoded in your application. 
```typescript
const tsAuthKey = this.node.tryGetContext('tsAuthKey') as string | undefined;

if (!tsAuthKey) {
  throw new Error('Tailscale auth key must be declared to deploy this stack. Set it with --context tsAuthKey=tsauth-1234');
}

new TailscaleBastion(stack, 'Cdk-Sample-Lib', {
  vpc,
  tailScaleAuthKey: tsAuthKey,
});
```


### TODO further docs



