'use server';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { DynamoDB } from '@aws-sdk/client-dynamodb';

const TABLE_NAME = process.env.TABLE_NAME;
const dynamoDb = DynamoDBDocument.from(new DynamoDB({region: process.env.REGION}));

export async function getHealth() {
  const data = await dynamoDb.get({
    TableName: TABLE_NAME,
    Key: {
      type: "matches"
    }
  });
  return data;
}
