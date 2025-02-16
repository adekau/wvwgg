import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const dynamoDb = DynamoDBDocument.from(new DynamoDB({ region: 'us-east-1' }));
const TABLE_NAME = process.env.TABLE_NAME;
const ANET_MATCHES_ENDPOINT = process.env.ANET_MATCHES_ENDPOINT;
const CACHE_EXPIRY_TIME = 60; // Cache expiry time in seconds

interface MatchData {
  // Define your match data structure here
  [key: string]: any; // temporary until real structure defined
}

interface CachedItem {
  type: string;
  data: MatchData;
  updatedAt: number;
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const cachedMatches = await getCachedMatches();
    if (cachedMatches && isCacheValid(cachedMatches.updatedAt)) {
      return {
        statusCode: 200,
        body: JSON.stringify(cachedMatches.data)
      };
    }
  } catch (ex) {
    console.error('Error getting cached matches', ex);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' })
    };
  }

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
    console.error(ex);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' })
    }
  }
}

const getCachedMatches = async () => {
  if (!TABLE_NAME) {
    throw new Error('TABLE_NAME environment variable is empty');
  }

  return (await dynamoDb.get({
    TableName: TABLE_NAME,
    Key: {
      type: "matches"
    }
  })).Item;
}

const saveCachedMatches = async (matchesResponse: MatchData): Promise<void> => {
  if (!TABLE_NAME) {
    throw new Error('TABLE_NAME environment variable is empty');
  }

  await dynamoDb.put({
    TableName: TABLE_NAME,
    Item: {
      type: "matches",
      data: matchesResponse,
      updatedAt: Date.now()
    }
  });
}

const isCacheValid = (timestamp: number): boolean => {
  const currentTime = Math.floor(Date.now() / 1000);
  const lastUpdated = Math.floor(timestamp / 1000);
  return (currentTime - lastUpdated) <= CACHE_EXPIRY_TIME;
}
