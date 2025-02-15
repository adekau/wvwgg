'use server';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { DynamoDB } from '@aws-sdk/client-dynamodb';

const TABLE_NAME = process.env.TABLE_NAME;
const dynamoDb = DynamoDBDocument.from(new DynamoDB({region: 'us-east-1'}));

export async function getHealth() {
  const data = await dynamoDb.get({
    TableName: TABLE_NAME,
    Key: {
      type: "matches"
    }
  });
  console.log('getHealth data', { TABLE_NAME, data });
  return data;
    // return Promise.resolve({
    //     TABLE_NAME: TABLE_NAME
    // });
}
