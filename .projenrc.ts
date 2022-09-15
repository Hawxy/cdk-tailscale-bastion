import { awscdk } from 'projen';
import { UpgradeDependenciesSchedule } from 'projen/lib/javascript';
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'JT',
  authorAddress: 'Hawxy@users.noreply.github.com',
  cdkVersion: '2.20.0',
  constructsVersion: '10.1.0',
  majorVersion: 1,
  defaultReleaseBranch: 'main',
  name: 'cdk-tailscale-bastion',
  repositoryUrl: 'https://github.com/Hawxy/cdk-tailscale-bastion.git',
  description: 'Deploys a AWS Bastion Host preconfigured for Tailscale access',
  projenrcTs: true,
  license: 'Apache-2.0',
  stability: 'stable',
  keywords: [
    'aws',
    'cdk',
    'bastion',
    'tailscale',
    'vpc',
  ],
  depsUpgradeOptions: { workflowOptions: { schedule: UpgradeDependenciesSchedule.WEEKLY } },
});
// remove in future version of projen
project.jest!.addTestMatch('**/?(*.)@(spec|test).[tj]s?(x)');
project.gitignore.addPatterns('cdk.out/');
project.synth();