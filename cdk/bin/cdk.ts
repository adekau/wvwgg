#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { DnsStack } from '../lib/dns-stack';
import { WvWGGStack } from '../lib/wvwgg-stack';
import { AutomationStack } from '../lib/automation-stack';

const app = new cdk.App();

const dnsStack = new DnsStack(app, 'WvWGG-Dns', {
  baseDomainName: 'wvw.gg',
  env: {
    region: 'us-east-1'
  }
});

const automationStack = new AutomationStack(app, 'WvWGG-Automation', {
  env: {
    region: 'us-east-1'
  }
});

if (process.env.WVWGG_STAGE === 'dev') {
  const devDeployment = new WvWGGStack(app, 'WvWGG-Dev', {
    zone: dnsStack.zone,
    certificate: dnsStack.certificate,
    stage: 'dev',
    domainNames: ['beta.wvw.gg'],
    env: {
      region: 'us-east-1'
    }
  });
  devDeployment.node.addDependency(dnsStack);
}

if (process.env.WVWGG_STAGE === 'prod') {
  const prodDeployment = new WvWGGStack(app, 'WvWGG-Prod', {
    zone: dnsStack.zone,
    certificate: dnsStack.certificate,
    stage: 'prod',
    domainNames: ['wvw.gg', 'www.wvw.gg'],
    env: {
      region: 'us-east-1'
    }
  });
  prodDeployment.node.addDependency(dnsStack);
}