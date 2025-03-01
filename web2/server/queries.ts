import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { unstable_cache } from "next/cache";
import { IFormattedMatch } from '../../shared/interfaces/formatted-match.interface';
import { IWorld } from '../../shared/interfaces/world.interface';
import { MatchId } from "../../shared/interfaces/match-id.type";
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

const ddbDocClient = DynamoDBDocument.from(ddbClient);

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
}

export const getMatchesDb = unstable_cache(async () => {
    console.log('Getting matches (db)');
    const res = await ddbDocClient.get({
        TableName: TABLE_NAME,
        Key: {
            type: 'matches',
            id: 'all'
        },
    });
    return res.Item?.data;
}, ['matches'], { revalidate: 60 });

export const getMatchesAnet = async () => {
    console.log('Getting matches (anet)');
    const res = await fetch('https://api.guildwars2.com/v2/wvw/matches?ids=all', { cache: 'force-cache', next: { revalidate: 60, tags: ['matches'] } });
    return await res.json();
}

export const getWorlds = unstable_cache(async () => {
    console.log('Getting worlds');
    try {
        return await ddbDocClient.get({
            TableName: TABLE_NAME,
            Key: {
                type: 'worlds',
                id: 'all'
            },
        }).then((res) => {
            return res.Item?.data;
        });
    } catch (error) {
        console.error('Falling back to fetching from Anet', error);
        return await fetch('https://api.guildwars2.com/v2/worlds?ids=all')
            .then((res) => res.json())
            .then((data) => [...data, ...j]);
    }
}, ['worlds'], { revalidate: 60 * 60 * 10 });

function getAllianceWorld(worldId: number, worlds: IWorld[]): IWorld | undefined {
    return worlds.find((x) => x.associated_world_id === worldId);
}

export function getMatchesData(matches: Record<string, any>[], worlds: IWorld[]): Record<MatchId, IFormattedMatch> {
    return matches.reduce((acc: Record<string, any>, match: any) => {
        const redWorld = getAllianceWorld(match.worlds?.red, worlds);
        const blueWorld = getAllianceWorld(match.worlds?.blue, worlds);
        const greenWorld = getAllianceWorld(match.worlds?.green, worlds);
        if (!redWorld || !blueWorld || !greenWorld) {
            throw new Error('A world could not be found');
        }

        return {
            ...acc, [match.id]: {
                id: match.id,
                red: {
                    world: redWorld,
                    kills: match.kills?.red,
                    deaths: match.deaths?.red,
                    activity: match.kills?.red + match.deaths?.red,
                    ratio: Math.trunc(((match.kills?.red ?? 0) / (match.deaths?.red ?? 1)) * 100) / 100,
                    victoryPoints: match.victory_points?.red,
                    skirmishScore: match.skirmishes ? match.skirmishes[match.skirmishes.length - 1].scores.red : 0
                },
                blue: {
                    world: blueWorld,
                    kills: match.kills?.blue,
                    deaths: match.deaths?.blue,
                    activity: match.kills?.blue + match.deaths?.blue,
                    ratio: Math.trunc(((match.kills?.blue ?? 0) / (match.deaths?.blue ?? 1)) * 100) / 100,
                    victoryPoints: match.victory_points?.blue,
                    skirmishScore: match.skirmishes ? match.skirmishes[match.skirmishes.length - 1].scores.blue : 0
                },
                green: {
                    world: greenWorld,
                    kills: match.kills?.green,
                    deaths: match.deaths?.green,
                    activity: match.kills?.green + match.deaths?.green,
                    ratio: Math.trunc(((match.kills?.green ?? 0) / (match.deaths?.green ?? 1)) * 100) / 100,
                    victoryPoints: match.victory_points?.green,
                    skirmishScore: match.skirmishes ? match.skirmishes[match.skirmishes.length - 1].scores.green : 0
                }
            } satisfies IFormattedMatch
        }
    }, {});
}