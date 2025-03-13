import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { unstable_cache } from 'next/cache';
import { IFormattedMatch } from '@shared/interfaces/formatted-match.interface';
import { MatchId } from '@shared/interfaces/match-id.type';
import { IMatchResponse } from '@shared/interfaces/match-response.interface';
import { formatMatches } from '@shared/util/format-matches';
import j from './tmp-alliance-worlds.json' with { type: 'json' };

const STAGE = process.env.WVWGG_STAGE;
const TABLE_NAME_LOCAL_DEV = process.env.TABLE_NAME_LOCAL_DEV;
const TABLE_NAME = STAGE == null ? TABLE_NAME_LOCAL_DEV : process.env.TABLE_NAME;

const ddbClient = new DynamoDB({
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        sessionToken: process.env.AWS_SESSION_TOKEN || ''
    }
});
const db = DynamoDBDocument.from(ddbClient);

export const getMatches = async () => {
    try {
        if (STAGE == null && TABLE_NAME_LOCAL_DEV == null) {
            return await getMatchesAnet();
        }
        const dbResult = await getMatchesDb();
        return dbResult;
    } catch (error) {
        console.error('Falling back to fetching from Anet', error);
        return await getMatchesAnet();
    }
};

export const getMatchesDb = unstable_cache(
    async () => {
        console.log('Getting matches (db)');
        const res = await db.get({
            TableName: TABLE_NAME,
            Key: {
                type: 'matches',
                id: 'all'
            }
        });
        return res.Item?.data as Record<MatchId, IFormattedMatch> | undefined;
    },
    ['matches'],
    { revalidate: 60 }
);

export const getMatchesAnet = async () => {
    console.log('Getting matches (anet)');
    const res = await fetch('https://api.guildwars2.com/v2/wvw/matches?ids=all', {
        cache: 'force-cache',
        next: { revalidate: 60, tags: ['matches'] }
    });
    const matchesResponse: IMatchResponse[] = await res.json();
    const worlds = await getWorlds();
    if (!worlds) {
        return undefined;
    }
    const formatted = formatMatches(matchesResponse, worlds);
    return formatted;
};

export const getWorlds = unstable_cache(
    async () => {
        console.log('Getting worlds');
        try {
            return await db
                .get({
                    TableName: TABLE_NAME,
                    Key: {
                        type: 'worlds',
                        id: 'all'
                    }
                })
                .then((res) => {
                    return res.Item?.data;
                });
        } catch (error) {
            console.error('Falling back to fetching from Anet', error);
            return await fetch('https://api.guildwars2.com/v2/worlds?ids=all')
                .then((res) => res.json())
                .then((data) => [...data, ...j]);
        }
    },
    ['worlds'],
    { revalidate: 60 * 60 * 10 }
);

export const getGuilds = async () => {
    console.log('Getting guilds');
    if (!TABLE_NAME) {
        return undefined;
    }
    try {
        const res = await db.query({
            TableName: TABLE_NAME,
            ExpressionAttributeNames: {
                '#type': 'type',
                '#data': 'data'
            },
            KeyConditionExpression: '#type = :type',
            ExpressionAttributeValues: {
                ':type': 'guild'
            },
            ProjectionExpression: '#type, #data',
            Limit: 10
        });
        return res.Items;
    } catch (error) {
        console.error('Falling back to fetching from Anet', error);
        return {};
    }
};
