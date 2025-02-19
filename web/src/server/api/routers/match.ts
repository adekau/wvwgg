import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { cache } from "react";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { IWorld } from '../../../../../shared/interfaces/world.interface';

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

export const matchRouter = createTRPCRouter({
  getNAMatches: publicProcedure.query(async () => {
    const matches = await getMatches();
    const worlds = await getWorlds();

    if (!worlds || !matches) {
      return {};
    }

    return getMatchesData(matches, worlds, 1);
  }),
  getMatch: publicProcedure.input(z.string()).query(async ({ input }) => {
    const matches = await getMatches();
    const worlds = await getWorlds();

    if (!worlds || !matches) {
      return {};
    }

    return getMatchesData(matches, worlds, 1)[input];
  })
});

export const getMatches = cache(async () => {
  console.log('Getting matches');
  return (await ddbDocClient.get({
    TableName: TABLE_NAME,
    Key: {
      type: 'matches',
    },
  })).Item?.data;
});

export const getWorlds = cache(async () => {
  console.log('Getting worlds');
  return (await ddbDocClient.get({
    TableName: TABLE_NAME,
    Key: {
      type: 'worlds',
    },
  })).Item?.data;
});

function getAllianceWorld(worldId: number, worlds: IWorld[]): IWorld | undefined {
  return worlds.find((x) => x.associated_world_id === worldId);
}

// Region: 1 = NA, 2 = EU
function getMatchesData(matches: Record<string, any>[], worlds: IWorld[], region: 1 | 2): Record<string, any> {
  return matches.reduce((acc: Record<string, any>, match: any) => {
    if (!match.id.startsWith(region.toString())) {
      return acc;
    }

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