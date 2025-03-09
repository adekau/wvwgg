import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import path from 'node:path';
import { AutomationStack } from './automation-stack';
import { WvWGGAssets } from './constructs/assets';
import { WvWGGBuild } from './constructs/build';
import { WvWGGDistribution } from './constructs/distribution';
import lambda = cdk.aws_lambda;
import lambdaNodejs = cdk.aws_lambda_nodejs;
import events = cdk.aws_events;
import eventTargets = cdk.aws_events_targets;
import route53 = cdk.aws_route53;
import acm = cdk.aws_certificatemanager;

interface WvWGGStackProps extends cdk.StackProps {
  zone: route53.HostedZone;
  certificate: acm.Certificate;
  stage: 'dev' | 'prod';
  domainNames: string[];
  automationStack: AutomationStack;
}

export class WvWGGStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: WvWGGStackProps) {
    super(scope, id, props);

    const build = new WvWGGBuild(this, 'WvWGGNextJsBuild', {
      buildCommand: 'npm run build',
      contextPath: path.join(__dirname, '../../web2')
    });

    const dynamoDbTable = new cdk.aws_dynamodb.TableV2(this, `WvWGGTable-${props.stage}`, {
      partitionKey: { name: 'type', type: cdk.aws_dynamodb.AttributeType.STRING },
      sortKey: { name: 'id', type: cdk.aws_dynamodb.AttributeType.STRING },
      billing: cdk.aws_dynamodb.Billing.onDemand()
    });
    dynamoDbTable.grantReadWriteData(props.automationStack.getGuildBatchLambda);

    const nextJsLambda = new lambda.DockerImageFunction(this, `WvWGGNextJsLambda-${props.stage}`, {
      code: build.nextJsImage,
      memorySize: 1024,
      timeout: cdk.Duration.seconds(30),
      ephemeralStorageSize: cdk.Size.mebibytes(512),
      environment: {
        AWS_LWA_ENABLE_COMPRESSION: "true",
        AWS_LWA_INVOKE_MODE: "response_stream",
        AWS_LWA_PORT: "3000",
        AWS_LWA_READINESS_CHECK_PORT: "3000",
        AWS_LWA_READINESS_CHECK_PATH: "/api/health",
        TABLE_NAME: dynamoDbTable.tableName,
        REGION: this.region,
        NODE_ENV: 'production',
        WVWGG_STAGE: props.stage
      }
    });
    // depends on the table being created first
    nextJsLambda.node.addDependency(dynamoDbTable);
    nextJsLambda.node.addDependency(build);
    dynamoDbTable.grantReadData(nextJsLambda);

    const fetchMatchesLambda = new lambdaNodejs.NodejsFunction(this, `WvWGGFetchMatchesLambda-${props.stage}`, {
      entry: path.join(__dirname, '../lambda/get-matches.ts'),
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'handler',
      timeout: cdk.Duration.seconds(15),
      environment: {
        TABLE_NAME: dynamoDbTable.tableName,
        ANET_MATCHES_ENDPOINT: 'https://api.guildwars2.com/v2/wvw/matches?ids=all',
        ANET_WORLDS_ENDPOINT: 'https://api.guildwars2.com/v2/worlds?ids=all',
        REGION: this.region
      }
    });
    fetchMatchesLambda.node.addDependency(dynamoDbTable);
    dynamoDbTable.grantReadWriteData(fetchMatchesLambda);

    const fetchWorldsLambda = new lambdaNodejs.NodejsFunction(this, `WvWGGFetchWorldsLambda-${props.stage}`, {
      entry: path.join(__dirname, '../lambda/get-worlds.ts'),
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'handler',
      timeout: cdk.Duration.seconds(15),
      environment: {
        ANET_WORLDS_ENDPOINT: 'https://api.guildwars2.com/v2/worlds?ids=all',
        TABLE_NAME: dynamoDbTable.tableName,
        REGION: this.region
      }
    });
    fetchWorldsLambda.node.addDependency(dynamoDbTable);
    dynamoDbTable.grantReadWriteData(fetchWorldsLambda);

    const fetchMatchesRule = new events.Rule(this, 'WvWGGFetchMatchesRule', {
      schedule: events.Schedule.rate(cdk.Duration.seconds(60)),
      targets: [new eventTargets.LambdaFunction(fetchMatchesLambda)],
    });
    fetchMatchesRule.node.addDependency(fetchMatchesLambda);

    const fetchWorldsRule = new events.Rule(this, 'WvWGGFetchWorldsRule', {
      schedule: events.Schedule.rate(cdk.Duration.days(1)),
      targets: [new eventTargets.LambdaFunction(fetchWorldsLambda)]
    });
    fetchWorldsRule.node.addDependency(fetchWorldsLambda);

    const nextJsAssets = new WvWGGAssets(this, `WvWGGNextJsAssets-${props.stage}`, {
      buildImageDigest: build.buildImageDigest,
      stage: props.stage
    });
    nextJsAssets.node.addDependency(build);

    const nextJsDistribution = new WvWGGDistribution(this, `WvWGGNextJsDistribution-${props.stage}`, {
      nextJsLambda,
      nextJsAssetsBucket: nextJsAssets.bucket,
      domainNames: props.domainNames,
      zone: props.zone,
      certificate: props.certificate,
      stage: props.stage
    });
    nextJsDistribution.node.addDependency(nextJsLambda);

    new cdk.CfnOutput(this, `WvWGGCloudFrontUrl`, {
      value: nextJsDistribution.distribution.domainName
    });
    new cdk.CfnOutput(this, `WvWGGDynamoDbTableName`, {
      value: dynamoDbTable.tableName
    });
  }
}
