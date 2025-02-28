import * as cdk from "aws-cdk-lib";
import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import path from "node:path";
import sfn = cdk.aws_stepfunctions;
import sfnTasks = cdk.aws_stepfunctions_tasks;
import events = cdk.aws_events;
import s3 = cdk.aws_s3;
import lambdaNode = cdk.aws_lambda_nodejs;
import lambda = cdk.aws_lambda;

export class AutomationStack extends Stack {
    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);

        const bucket = new s3.Bucket(this, 'automation-results-bucket', {
            publicReadAccess: false, 
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,           
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true
        });

        // const connection = new events.Connection(this, 'gw2-api-connection', {
        //     // not an actual api key, gw2 doesn't require one but it's required by aws
        //     authorization: events.Authorization.apiKey('gw2', cdk.SecretValue.unsafePlainText('gw2')) 
        // });

        const getNaWvwGuildsLambda = new lambdaNode.NodejsFunction(this, 'get-na-wvw-guilds-lambda', {
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
        getNaWvwGuildsLambda.node.addDependency(bucket);
        bucket.grantReadWrite(getNaWvwGuildsLambda);

        // const resultWriter = new sfn.ResultWriter({
        //     bucket
        // });

        const getNaWvwGuilds = new sfnTasks.LambdaInvoke(this, 'get-na-wvw-guilds', {
            lambdaFunction: getNaWvwGuildsLambda
        });
        getNaWvwGuilds.node.addDependency(getNaWvwGuildsLambda);

        // const getNaWvwGuilds = new sfnTasks.HttpInvoke(this, 'get-na-wvw-guilds', {
        //     apiEndpoint: sfn.TaskInput.fromText('wvw/guilds/na'),
        //     method: sfn.TaskInput.fromText('GET'),
        //     headers: sfn.TaskInput.fromObject({
        //         'Content-Type': 'application/json',
        //         'Accept': 'application/json',
        //     }),
        //     connection,
        //     apiRoot: 'https://api.guildwars2.com/v2',
        //     queryLanguage: sfn.QueryLanguage.JSONATA,
        //     outputs: resultWriter.render()
        // });

        const populateWvwGuildsMachine = new sfn.StateMachine(this, 'populate-wvw-guilds', {
            definitionBody: sfn.DefinitionBody.fromChainable(getNaWvwGuilds)
        });
    }
}