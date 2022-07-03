const { awscdk } = require('projen');
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'JT',
  authorAddress: 'Hawxy@users.noreply.github.com',
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
  name: 'aws-cdk-tailscale-bastion',
  repositoryUrl: 'https://github.com/Hawxy/aws-cdk-tailscale-bastion.git',

  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();