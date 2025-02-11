import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import path from 'node:path';
import { NextJsBuild } from './build';
import { NextJsDistribution } from './distribution';
import { NextJsAssets } from './assets';
import lambda = cdk.aws_lambda;

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const build = new NextJsBuild(this, 'WvWGGNextJsBuild', {
      buildCommand: 'npm run build',
      contextPath: path.join(__dirname, '../../web')
    });

    const nextJsLambda = new lambda.DockerImageFunction(this, 'WvWGGNextJsLambda', {
      code: build.nextJsImage,
      memorySize: 1024,
      timeout: cdk.Duration.seconds(30),
      environment: {
        AWS_LWA_ENABLE_COMPRESSION: "true",
        // TODO: See what I need to make this RESPONSE_STREAM (see also distribution.ts function url)
        // AWS_LWA_INVOKE_MODE: "response_stream",
      }
    });

    const nextJsAssets = new NextJsAssets(this, 'WvWGGNextJsAssets', {
      buildImageDigest: build.buildImageDigest,
    });

    const nextJsDistribution = new NextJsDistribution(this, 'WvWGGNextJsDistribution', {
      nextJsLambda,
      nextJsAssetsBucket: nextJsAssets.bucket
    });


    new cdk.CfnOutput(this, 'WvWGGCloudFrontUrl', {
      value: nextJsDistribution.distribution.domainName
    });
  }
}

