#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { DnsStack } from '../lib/dns-stack';
import { WvWGGStack } from '../lib/wvwgg-stack';

const app = new cdk.App();

const dnsStack = new DnsStack(app, 'WvWGG-Dns', {
  baseDomainName: 'wvw.gg',
  env: {
    region: 'us-east-1'
  }
});

const devDeployment = new WvWGGStack(app, 'WvWGG-Dev', {
  zone: dnsStack.zone,
  certificate: dnsStack.certificate,
  stage: 'dev',
  domainNames: ['beta.wvw.gg'],
  env: {
    region: 'us-east-1'
  }
});

const prodDeployment = new WvWGGStack(app, 'WvWGG-Prod', {
  zone: dnsStack.zone,
  certificate: dnsStack.certificate,
  stage: 'prod',
  domainNames: ['wvw.gg', 'www.wvw.gg'],
  env: {
    region: 'us-east-1'
  }
});