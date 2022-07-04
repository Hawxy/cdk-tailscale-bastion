# cdk-tailscale-bastion

This packages creates an AWS Bastion configured for Tailscale. This covers steps 1,2 & 4 of the [Tailscale RDS](https://tailscale.com/kb/1141/aws-rds/) guide

You may find this package useful if you need high performance access to internal resources (ie RDS) without the overhead & limitations of Session Manager.

The Tailscale Auth key should be passed in via parameter store or secrets manager and NOT hardcoded in your application. 
```typescript
// Secrets Manager
const secret = Secret.fromSecretNameV2(stack, 'ApiSecrets', 'tailscale').secretValueFromJson('AUTH_KEY');
// Systems Manager Parameter Store
const altSecret = SecretValue.ssmSecure('/tsauth');

new TailscaleBastion(stack, 'Cdk-Sample-Lib', {
  vpc,
  tailScaleAuthKey: secret,
});
```


### TODO further docs



