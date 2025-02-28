import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const TABLE_NAME = process.env.TABLE_NAME;
const ANET_MATCHES_ENDPOINT = process.env.ANET_MATCHES_ENDPOINT;
const REGION = process.env.REGION;
const dynamoDb = DynamoDBDocument.from(new DynamoDB({ region: REGION }));

interface MatchData {
  // Define your match data structure here
  [key: string]: any; // temporary until real structure defined
}

export const handler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (!ANET_MATCHES_ENDPOINT) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' })
    };
  }

  try {
    const res = await fetch(ANET_MATCHES_ENDPOINT, { method: 'GET' }).then((c) => c.json());
    await saveCachedMatches(res);

    return {
      statusCode: 200,
      body: JSON.stringify(res)
    };
  } catch (ex) {
    console.error('Error fetching or saving matches', ex);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' })
    }
  }
}

const saveCachedMatches = async (matchesResponse: MatchData): Promise<void> => {
  if (!TABLE_NAME) {
    throw new Error('TABLE_NAME environment variable is empty');
  }

  await dynamoDb.put({
    TableName: TABLE_NAME,
    Item: {
      type: "matches",
      id: "all",
      data: matchesResponse,
      updatedAt: Date.now()
    }
  });
}