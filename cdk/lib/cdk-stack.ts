import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import path from 'node:path';
import { NextJsAssets } from './assets';
import { NextJsBuild } from './build';
import { NextJsDistribution } from './distribution';
import lambda = cdk.aws_lambda;
import lambdaNodejs = cdk.aws_lambda_nodejs;
import events = cdk.aws_events;
import eventTargets = cdk.aws_events_targets;

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const build = new NextJsBuild(this, 'WvWGGNextJsBuild', {
      buildCommand: 'npm run build',
      contextPath: path.join(__dirname, '../../web')
    });

    const dynamoDbTable = new cdk.aws_dynamodb.TableV2(this, 'WvWGGTable', {
      partitionKey: { name: 'type', type: cdk.aws_dynamodb.AttributeType.STRING },
      billing: cdk.aws_dynamodb.Billing.onDemand()
    });

    const nextJsLambda = new lambda.DockerImageFunction(this, 'WvWGGNextJsLambda', {
      code: build.nextJsImage,
      memorySize: 1024,
      timeout: cdk.Duration.seconds(30),
      environment: {
        AWS_LWA_ENABLE_COMPRESSION: "true",
        AWS_LWA_INVOKE_MODE: "response_stream",
        AWS_LWA_PORT: "3000",
        AWS_LWA_READINESS_CHECK_PORT: "3000",
        AWS_LWA_READINESS_CHECK_PATH: "/api/health",
        TABLE_NAME: dynamoDbTable.tableName,
        REGION: this.region,
        NODE_ENV: 'production'
      }
    });
    const fetchMatchesLambda = new lambdaNodejs.NodejsFunction(this, 'WvWGGFetchMatchesLambda', {
      entry: path.join(__dirname, '../lambda/match-cache.ts'),
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'handler',
      timeout: cdk.Duration.seconds(15),
      environment: {
        TABLE_NAME: dynamoDbTable.tableName,
        ANET_MATCHES_ENDPOINT: 'https://api.guildwars2.com/v2/wvw/matches?ids=all',
        REGION: this.region
      }
    });
    dynamoDbTable.grantReadWriteData(nextJsLambda);
    dynamoDbTable.grantReadWriteData(fetchMatchesLambda);

    new events.Rule(this, 'WvWGGFetchMatchesRule', {
      schedule: events.Schedule.rate(cdk.Duration.seconds(60)),
      targets: [new eventTargets.LambdaFunction(fetchMatchesLambda)]
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
