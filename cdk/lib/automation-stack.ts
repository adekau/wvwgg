import * as cdk from "aws-cdk-lib";
import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import path from "node:path";
import sfn = cdk.aws_stepfunctions;
import sfnTasks = cdk.aws_stepfunctions_tasks;
import s3 = cdk.aws_s3;
import lambdaNode = cdk.aws_lambda_nodejs;
import lambda = cdk.aws_lambda;

export class AutomationStack extends Stack {
    public readonly getGuildBatchLambda: lambdaNode.NodejsFunction;

    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);

        const bucket = new s3.Bucket(this, 'automation-results-bucket', {
            publicReadAccess: false, 
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,           
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true
        });

        const getWvwGuildsLambda = new lambdaNode.NodejsFunction(this, 'get-wvw-guilds-lambda', {
            entry: path.join(__dirname, '../lambda/get-wvw-guilds.ts'),
            runtime: lambda.Runtime.NODEJS_22_X,
            handler: 'handler',
            timeout: cdk.Duration.seconds(30),
            environment: {
                REGION: this.region,
                BUCKET_NAME: bucket.bucketName,
                WVW_GUILDS_ENDPOINT: 'https://api.guildwars2.com/v2/wvw/guilds'
            }
        });
        getWvwGuildsLambda.node.addDependency(bucket);
        bucket.grantWrite(getWvwGuildsLambda);

        this.getGuildBatchLambda = new lambdaNode.NodejsFunction(this, 'get-guild-batch-lambda', {
            entry: path.join(__dirname, '../lambda/get-guild-batch.ts'),
            runtime: lambda.Runtime.NODEJS_22_X,
            handler: 'handler',
            timeout: cdk.Duration.seconds(30),
            environment: {
                REGION: this.region,
                ANET_GUILD_ENDPOINT: 'https://api.guildwars2.com/v2/guild',
            }
        });

        const getWvwGuilds = new sfnTasks.LambdaInvoke(this, 'get-wvw-guilds', {
            lambdaFunction: getWvwGuildsLambda
        });
        getWvwGuilds.node.addDependency(getWvwGuildsLambda);

        // TODO: add step to loop over the count of guilds and call a lambda to get the guilds with a batch size of 40 every 10 seconds
        // const getWvwGuildsLoop = new sfn.Map(this, 'get-wvw-guilds-loop', {
        //     maxConcurrency: 1
        // });
        // getWvwGuildsLoop.addIterator()

        const populateWvwGuildsMachine = new sfn.StateMachine(this, 'populate-wvw-guilds', {
            definitionBody: sfn.DefinitionBody.fromChainable(getWvwGuilds)
        });
    }
}