# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### TailscaleBastion <a name="TailscaleBastion" id="cdk-tailscale-bastion.TailscaleBastion"></a>

#### Initializers <a name="Initializers" id="cdk-tailscale-bastion.TailscaleBastion.Initializer"></a>

```typescript
import { TailscaleBastion } from 'cdk-tailscale-bastion'

new TailscaleBastion(scope: Construct, id: string, props: TailscaleBastionProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-tailscale-bastion.TailscaleBastion.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#cdk-tailscale-bastion.TailscaleBastion.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-tailscale-bastion.TailscaleBastion.Initializer.parameter.props">props</a></code> | <code><a href="#cdk-tailscale-bastion.TailscaleBastionProps">TailscaleBastionProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cdk-tailscale-bastion.TailscaleBastion.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="cdk-tailscale-bastion.TailscaleBastion.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="cdk-tailscale-bastion.TailscaleBastion.Initializer.parameter.props"></a>

- *Type:* <a href="#cdk-tailscale-bastion.TailscaleBastionProps">TailscaleBastionProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-tailscale-bastion.TailscaleBastion.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="cdk-tailscale-bastion.TailscaleBastion.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-tailscale-bastion.TailscaleBastion.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="cdk-tailscale-bastion.TailscaleBastion.isConstruct"></a>

```typescript
import { TailscaleBastion } from 'cdk-tailscale-bastion'

TailscaleBastion.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="cdk-tailscale-bastion.TailscaleBastion.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-tailscale-bastion.TailscaleBastion.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cdk-tailscale-bastion.TailscaleBastion.property.bastion">bastion</a></code> | <code>aws-cdk-lib.aws_ec2.BastionHostLinux</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="cdk-tailscale-bastion.TailscaleBastion.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `bastion`<sup>Required</sup> <a name="bastion" id="cdk-tailscale-bastion.TailscaleBastion.property.bastion"></a>

```typescript
public readonly bastion: BastionHostLinux;
```

- *Type:* aws-cdk-lib.aws_ec2.BastionHostLinux

---


## Structs <a name="Structs" id="Structs"></a>

### SecretsManagerAuthKey <a name="SecretsManagerAuthKey" id="cdk-tailscale-bastion.SecretsManagerAuthKey"></a>

#### Initializer <a name="Initializer" id="cdk-tailscale-bastion.SecretsManagerAuthKey.Initializer"></a>

```typescript
import { SecretsManagerAuthKey } from 'cdk-tailscale-bastion'

const secretsManagerAuthKey: SecretsManagerAuthKey = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-tailscale-bastion.SecretsManagerAuthKey.property.key">key</a></code> | <code>string</code> | The key of the auth key value located within the provided secret. |
| <code><a href="#cdk-tailscale-bastion.SecretsManagerAuthKey.property.secret">secret</a></code> | <code>aws-cdk-lib.aws_secretsmanager.ISecret</code> | Secret manager location where the tailscale auth key is stored. |

---

##### `key`<sup>Required</sup> <a name="key" id="cdk-tailscale-bastion.SecretsManagerAuthKey.property.key"></a>

```typescript
public readonly key: string;
```

- *Type:* string

The key of the auth key value located within the provided secret.

---

##### `secret`<sup>Required</sup> <a name="secret" id="cdk-tailscale-bastion.SecretsManagerAuthKey.property.secret"></a>

```typescript
public readonly secret: ISecret;
```

- *Type:* aws-cdk-lib.aws_secretsmanager.ISecret

Secret manager location where the tailscale auth key is stored.

Must be in the standard key/value JSON format.

---

### TailscaleBastionProps <a name="TailscaleBastionProps" id="cdk-tailscale-bastion.TailscaleBastionProps"></a>

#### Initializer <a name="Initializer" id="cdk-tailscale-bastion.TailscaleBastionProps.Initializer"></a>

```typescript
import { TailscaleBastionProps } from 'cdk-tailscale-bastion'

const tailscaleBastionProps: TailscaleBastionProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-tailscale-bastion.TailscaleBastionProps.property.tailscaleCredentials">tailscaleCredentials</a></code> | <code><a href="#cdk-tailscale-bastion.TailscaleCredentials">TailscaleCredentials</a></code> | Credential settings for the tailscale auth key. |
| <code><a href="#cdk-tailscale-bastion.TailscaleBastionProps.property.vpc">vpc</a></code> | <code>aws-cdk-lib.aws_ec2.IVpc</code> | VPC to launch the instance in. |
| <code><a href="#cdk-tailscale-bastion.TailscaleBastionProps.property.additionalInit">additionalInit</a></code> | <code>aws-cdk-lib.aws_ec2.InitElement[]</code> | Additional cloudformation init actions to perform during startup. |
| <code><a href="#cdk-tailscale-bastion.TailscaleBastionProps.property.advertiseRoute">advertiseRoute</a></code> | <code>string</code> | Advertise a custom route instead of using the VPC CIDR, used for Tailscale 4via6 support. |
| <code><a href="#cdk-tailscale-bastion.TailscaleBastionProps.property.availabilityZone">availabilityZone</a></code> | <code>string</code> | In which AZ to place the instance within the VPC. |
| <code><a href="#cdk-tailscale-bastion.TailscaleBastionProps.property.cachedInContext">cachedInContext</a></code> | <code>boolean</code> | Setting this to true will result in the Amazon Linux AMI being cached in `cdk.context.json` and prevent the instance being replaced when the image is updated. Enable this if you'd like to use non-reusable Tailscale keys, or you'd like the instance to remain stable. Keep in mind that the AMI will grow old over time and is it your responsibility to evict it from the context. |
| <code><a href="#cdk-tailscale-bastion.TailscaleBastionProps.property.cpuType">cpuType</a></code> | <code>aws-cdk-lib.aws_ec2.AmazonLinuxCpuType</code> | CPU Type of the instance. |
| <code><a href="#cdk-tailscale-bastion.TailscaleBastionProps.property.incomingRoutes">incomingRoutes</a></code> | <code>string[]</code> | List of incoming routes from Tailscale network. |
| <code><a href="#cdk-tailscale-bastion.TailscaleBastionProps.property.instanceName">instanceName</a></code> | <code>string</code> | The name of the instance. |
| <code><a href="#cdk-tailscale-bastion.TailscaleBastionProps.property.instanceType">instanceType</a></code> | <code>aws-cdk-lib.aws_ec2.InstanceType</code> | Type of instance to launch. |
| <code><a href="#cdk-tailscale-bastion.TailscaleBastionProps.property.securityGroup">securityGroup</a></code> | <code>aws-cdk-lib.aws_ec2.ISecurityGroup</code> | Security Group to assign to this instance. |
| <code><a href="#cdk-tailscale-bastion.TailscaleBastionProps.property.subnetSelection">subnetSelection</a></code> | <code>aws-cdk-lib.aws_ec2.SubnetSelection</code> | Select the subnets to run the bastion host in. |

---

##### `tailscaleCredentials`<sup>Required</sup> <a name="tailscaleCredentials" id="cdk-tailscale-bastion.TailscaleBastionProps.property.tailscaleCredentials"></a>

```typescript
public readonly tailscaleCredentials: TailscaleCredentials;
```

- *Type:* <a href="#cdk-tailscale-bastion.TailscaleCredentials">TailscaleCredentials</a>

Credential settings for the tailscale auth key.

One type must be used.
Ephemeral keys are recommended.

---

##### `vpc`<sup>Required</sup> <a name="vpc" id="cdk-tailscale-bastion.TailscaleBastionProps.property.vpc"></a>

```typescript
public readonly vpc: IVpc;
```

- *Type:* aws-cdk-lib.aws_ec2.IVpc

VPC to launch the instance in.

---

##### `additionalInit`<sup>Optional</sup> <a name="additionalInit" id="cdk-tailscale-bastion.TailscaleBastionProps.property.additionalInit"></a>

```typescript
public readonly additionalInit: InitElement[];
```

- *Type:* aws-cdk-lib.aws_ec2.InitElement[]

Additional cloudformation init actions to perform during startup.

---

##### `advertiseRoute`<sup>Optional</sup> <a name="advertiseRoute" id="cdk-tailscale-bastion.TailscaleBastionProps.property.advertiseRoute"></a>

```typescript
public readonly advertiseRoute: string;
```

- *Type:* string

Advertise a custom route instead of using the VPC CIDR, used for Tailscale 4via6 support.

---

##### `availabilityZone`<sup>Optional</sup> <a name="availabilityZone" id="cdk-tailscale-bastion.TailscaleBastionProps.property.availabilityZone"></a>

```typescript
public readonly availabilityZone: string;
```

- *Type:* string
- *Default:* Random zone.

In which AZ to place the instance within the VPC.

---

##### `cachedInContext`<sup>Optional</sup> <a name="cachedInContext" id="cdk-tailscale-bastion.TailscaleBastionProps.property.cachedInContext"></a>

```typescript
public readonly cachedInContext: boolean;
```

- *Type:* boolean
- *Default:* false

Setting this to true will result in the Amazon Linux AMI being cached in `cdk.context.json` and prevent the instance being replaced when the image is updated. Enable this if you'd like to use non-reusable Tailscale keys, or you'd like the instance to remain stable. Keep in mind that the AMI will grow old over time and is it your responsibility to evict it from the context.

---

##### `cpuType`<sup>Optional</sup> <a name="cpuType" id="cdk-tailscale-bastion.TailscaleBastionProps.property.cpuType"></a>

```typescript
public readonly cpuType: AmazonLinuxCpuType;
```

- *Type:* aws-cdk-lib.aws_ec2.AmazonLinuxCpuType
- *Default:* AmazonLinuxCpuType.X86_64

CPU Type of the instance.

---

##### `incomingRoutes`<sup>Optional</sup> <a name="incomingRoutes" id="cdk-tailscale-bastion.TailscaleBastionProps.property.incomingRoutes"></a>

```typescript
public readonly incomingRoutes: string[];
```

- *Type:* string[]
- *Default:* none

List of incoming routes from Tailscale network.

VPC route table will get these targets added.

---

##### `instanceName`<sup>Optional</sup> <a name="instanceName" id="cdk-tailscale-bastion.TailscaleBastionProps.property.instanceName"></a>

```typescript
public readonly instanceName: string;
```

- *Type:* string
- *Default:* 'BastionHostTailscale'

The name of the instance.

---

##### `instanceType`<sup>Optional</sup> <a name="instanceType" id="cdk-tailscale-bastion.TailscaleBastionProps.property.instanceType"></a>

```typescript
public readonly instanceType: InstanceType;
```

- *Type:* aws-cdk-lib.aws_ec2.InstanceType
- *Default:* 't3.nano'

Type of instance to launch.

---

##### `securityGroup`<sup>Optional</sup> <a name="securityGroup" id="cdk-tailscale-bastion.TailscaleBastionProps.property.securityGroup"></a>

```typescript
public readonly securityGroup: ISecurityGroup;
```

- *Type:* aws-cdk-lib.aws_ec2.ISecurityGroup
- *Default:* create new security group with no inbound and all outbound traffic allowed

Security Group to assign to this instance.

---

##### `subnetSelection`<sup>Optional</sup> <a name="subnetSelection" id="cdk-tailscale-bastion.TailscaleBastionProps.property.subnetSelection"></a>

```typescript
public readonly subnetSelection: SubnetSelection;
```

- *Type:* aws-cdk-lib.aws_ec2.SubnetSelection
- *Default:* PUBLIC subnets of the supplied VPC

Select the subnets to run the bastion host in.

PUBLIC subnets are used by default to allow for a direct Tailscale connection. DERP nodes will be used in a private subnet.

---

### TailscaleCredentials <a name="TailscaleCredentials" id="cdk-tailscale-bastion.TailscaleCredentials"></a>

#### Initializer <a name="Initializer" id="cdk-tailscale-bastion.TailscaleCredentials.Initializer"></a>

```typescript
import { TailscaleCredentials } from 'cdk-tailscale-bastion'

const tailscaleCredentials: TailscaleCredentials = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-tailscale-bastion.TailscaleCredentials.property.secretsManager">secretsManager</a></code> | <code><a href="#cdk-tailscale-bastion.SecretsManagerAuthKey">SecretsManagerAuthKey</a></code> | Fetches the Auth Key from secrets manager. |
| <code><a href="#cdk-tailscale-bastion.TailscaleCredentials.property.unsafeString">unsafeString</a></code> | <code>string</code> | Provides an auth key as a plaintext string. |

---

##### `secretsManager`<sup>Optional</sup> <a name="secretsManager" id="cdk-tailscale-bastion.TailscaleCredentials.property.secretsManager"></a>

```typescript
public readonly secretsManager: SecretsManagerAuthKey;
```

- *Type:* <a href="#cdk-tailscale-bastion.SecretsManagerAuthKey">SecretsManagerAuthKey</a>

Fetches the Auth Key from secrets manager.

This value will be fetched during bastion startup.

---

##### `unsafeString`<sup>Optional</sup> <a name="unsafeString" id="cdk-tailscale-bastion.TailscaleCredentials.property.unsafeString"></a>

```typescript
public readonly unsafeString: string;
```

- *Type:* string

Provides an auth key as a plaintext string.

This option will expose the auth key in your CDK template and should only be used with non-reusable keys.
Potentially useful for DevOps runbooks and temporary instances.

---



