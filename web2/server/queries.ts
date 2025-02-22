import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { unstable_cache } from "next/cache";
import { IWorld } from '../../shared/interfaces/world.interface';

const TABLE_NAME = process.env.TABLE_NAME;
const ddbClient = new DynamoDB({
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        sessionToken: process.env.AWS_SESSION_TOKEN || ''
    }
});

const ddbDocClient = DynamoDBDocument.from(ddbClient);

export const getMatches = unstable_cache(() => {
    console.log('Getting matches');
    return ddbDocClient.get({
        TableName: TABLE_NAME,
        Key: {
            type: 'matches',
        },
    }).then((res) => {
        console.log('From dynamo (matches)', res);
        return res.Item?.data;
    });
}, ['matches'], { revalidate: 60 });

export const getWorlds = unstable_cache(() => {
    console.log('Getting worlds');
    return ddbDocClient.get({
        TableName: TABLE_NAME,
        Key: {
            type: 'worlds',
        },
    }).then((res) => {
        console.log('From dynamo (worlds)', res);
        return res.Item?.data;
    });
}, ['worlds'], { revalidate: 60 * 60 * 10 });

function getAllianceWorld(worldId: number, worlds: IWorld[]): IWorld | undefined {
    return worlds.find((x) => x.associated_world_id === worldId);
}

export function getMatchesData(matches: Record<string, any>[], worlds: IWorld[]): Record<string, any> {
    return matches.reduce((acc: Record<string, any>, match: any) => {
        return {
            ...acc, [match.id]: {
                id: match.id,
                red: {
                    world: getAllianceWorld(match.worlds?.red, worlds),
                    kills: match.kills?.red,
                    deaths: match.deaths?.red,
                    ratio: Math.trunc(((match.kills?.red ?? 0) / (match.deaths?.red ?? 1)) * 100) / 100,
                    victoryPoints: match.victory_points?.red,
                    skirmishScore: match.skirmishes ? match.skirmishes[match.skirmishes.length - 1].scores.red : 0
                },
                blue: {
                    world: getAllianceWorld(match.worlds?.blue, worlds),
                    kills: match.kills?.blue,
                    deaths: match.deaths?.blue,
                    ratio: Math.trunc(((match.kills?.blue ?? 0) / (match.deaths?.blue ?? 1)) * 100) / 100,
                    victoryPoints: match.victory_points?.blue,
                    skirmishScore: match.skirmishes ? match.skirmishes[match.skirmishes.length - 1].scores.blue : 0
                },
                green: {
                    world: getAllianceWorld(match.worlds?.green, worlds),
                    kills: match.kills?.green,
                    deaths: match.deaths?.green,
                    ratio: Math.trunc(((match.kills?.green ?? 0) / (match.deaths?.green ?? 1)) * 100) / 100,
                    victoryPoints: match.victory_points?.green,
                    skirmishScore: match.skirmishes ? match.skirmishes[match.skirmishes.length - 1].scores.green : 0
                }
            }
        }
    }, {});
}