# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### TailscaleBastion <a name="TailscaleBastion" id="aws-cdk-tailscale-bastion.TailscaleBastion"></a>

#### Initializers <a name="Initializers" id="aws-cdk-tailscale-bastion.TailscaleBastion.Initializer"></a>

```typescript
import { TailscaleBastion } from 'aws-cdk-tailscale-bastion'

new TailscaleBastion(scope: Construct, id: string, props: TailscaleBastionProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#aws-cdk-tailscale-bastion.TailscaleBastion.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#aws-cdk-tailscale-bastion.TailscaleBastion.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#aws-cdk-tailscale-bastion.TailscaleBastion.Initializer.parameter.props">props</a></code> | <code><a href="#aws-cdk-tailscale-bastion.TailscaleBastionProps">TailscaleBastionProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="aws-cdk-tailscale-bastion.TailscaleBastion.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="aws-cdk-tailscale-bastion.TailscaleBastion.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="aws-cdk-tailscale-bastion.TailscaleBastion.Initializer.parameter.props"></a>

- *Type:* <a href="#aws-cdk-tailscale-bastion.TailscaleBastionProps">TailscaleBastionProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#aws-cdk-tailscale-bastion.TailscaleBastion.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="aws-cdk-tailscale-bastion.TailscaleBastion.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#aws-cdk-tailscale-bastion.TailscaleBastion.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="aws-cdk-tailscale-bastion.TailscaleBastion.isConstruct"></a>

```typescript
import { TailscaleBastion } from 'aws-cdk-tailscale-bastion'

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

###### `x`<sup>Required</sup> <a name="x" id="aws-cdk-tailscale-bastion.TailscaleBastion.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#aws-cdk-tailscale-bastion.TailscaleBastion.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#aws-cdk-tailscale-bastion.TailscaleBastion.property.bastion">bastion</a></code> | <code>aws-cdk-lib.aws_ec2.BastionHostLinux</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="aws-cdk-tailscale-bastion.TailscaleBastion.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `bastion`<sup>Required</sup> <a name="bastion" id="aws-cdk-tailscale-bastion.TailscaleBastion.property.bastion"></a>

```typescript
public readonly bastion: BastionHostLinux;
```

- *Type:* aws-cdk-lib.aws_ec2.BastionHostLinux

---


## Structs <a name="Structs" id="Structs"></a>

### TailscaleBastionProps <a name="TailscaleBastionProps" id="aws-cdk-tailscale-bastion.TailscaleBastionProps"></a>

#### Initializer <a name="Initializer" id="aws-cdk-tailscale-bastion.TailscaleBastionProps.Initializer"></a>

```typescript
import { TailscaleBastionProps } from 'aws-cdk-tailscale-bastion'

const tailscaleBastionProps: TailscaleBastionProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#aws-cdk-tailscale-bastion.TailscaleBastionProps.property.tailScaleAuthKey">tailScaleAuthKey</a></code> | <code>string</code> | Auth key generated from Tailscale. |
| <code><a href="#aws-cdk-tailscale-bastion.TailscaleBastionProps.property.vpc">vpc</a></code> | <code>aws-cdk-lib.aws_ec2.Vpc</code> | VPC to launch the instance in. |
| <code><a href="#aws-cdk-tailscale-bastion.TailscaleBastionProps.property.availabilityZone">availabilityZone</a></code> | <code>string</code> | In which AZ to place the instance within the VPC. |
| <code><a href="#aws-cdk-tailscale-bastion.TailscaleBastionProps.property.instanceName">instanceName</a></code> | <code>string</code> | The name of the instance. |
| <code><a href="#aws-cdk-tailscale-bastion.TailscaleBastionProps.property.instanceType">instanceType</a></code> | <code>aws-cdk-lib.aws_ec2.InstanceType</code> | Type of instance to launch. |
| <code><a href="#aws-cdk-tailscale-bastion.TailscaleBastionProps.property.securityGroup">securityGroup</a></code> | <code>aws-cdk-lib.aws_ec2.ISecurityGroup</code> | Security Group to assign to this instance. |
| <code><a href="#aws-cdk-tailscale-bastion.TailscaleBastionProps.property.subnetSelection">subnetSelection</a></code> | <code>aws-cdk-lib.aws_ec2.SubnetSelection</code> | Select the subnets to run the bastion host in. |

---

##### `tailScaleAuthKey`<sup>Required</sup> <a name="tailScaleAuthKey" id="aws-cdk-tailscale-bastion.TailscaleBastionProps.property.tailScaleAuthKey"></a>

```typescript
public readonly tailScaleAuthKey: string;
```

- *Type:* string

Auth key generated from Tailscale.

Ephemeral keys are recommended.

---

##### `vpc`<sup>Required</sup> <a name="vpc" id="aws-cdk-tailscale-bastion.TailscaleBastionProps.property.vpc"></a>

```typescript
public readonly vpc: Vpc;
```

- *Type:* aws-cdk-lib.aws_ec2.Vpc

VPC to launch the instance in.

---

##### `availabilityZone`<sup>Optional</sup> <a name="availabilityZone" id="aws-cdk-tailscale-bastion.TailscaleBastionProps.property.availabilityZone"></a>

```typescript
public readonly availabilityZone: string;
```

- *Type:* string
- *Default:* Random zone.

In which AZ to place the instance within the VPC.

---

##### `instanceName`<sup>Optional</sup> <a name="instanceName" id="aws-cdk-tailscale-bastion.TailscaleBastionProps.property.instanceName"></a>

```typescript
public readonly instanceName: string;
```

- *Type:* string
- *Default:* 'BastionHost'

The name of the instance.

---

##### `instanceType`<sup>Optional</sup> <a name="instanceType" id="aws-cdk-tailscale-bastion.TailscaleBastionProps.property.instanceType"></a>

```typescript
public readonly instanceType: InstanceType;
```

- *Type:* aws-cdk-lib.aws_ec2.InstanceType
- *Default:* 't3.nano'

Type of instance to launch.

---

##### `securityGroup`<sup>Optional</sup> <a name="securityGroup" id="aws-cdk-tailscale-bastion.TailscaleBastionProps.property.securityGroup"></a>

```typescript
public readonly securityGroup: ISecurityGroup;
```

- *Type:* aws-cdk-lib.aws_ec2.ISecurityGroup
- *Default:* create new security group with no inbound and all outbound traffic allowed

Security Group to assign to this instance.

---

##### `subnetSelection`<sup>Optional</sup> <a name="subnetSelection" id="aws-cdk-tailscale-bastion.TailscaleBastionProps.property.subnetSelection"></a>

```typescript
public readonly subnetSelection: SubnetSelection;
```

- *Type:* aws-cdk-lib.aws_ec2.SubnetSelection
- *Default:* PUBLIC subnets of the supplied VPC

Select the subnets to run the bastion host in.

PUBLIC subnets are used by default to allow for a direct Tailscale connection. DERP nodes will be used in a private subnet.

---



