import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

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

export const postRouter = createTRPCRouter({
  // create: publicProcedure
  //   .input(z.object({ name: z.string().min(1) }))
  //   .mutation(async ({ input }) => {
  //     const post: Post = {
  //       id: posts.length + 1,
  //       name: input.name,
  //     };
  //     posts.push(post);
  //     return post;
  //   }),
  getData: publicProcedure.query(async () => {
    const result = await ddbDocClient.get({
      TableName: TABLE_NAME,
      Key: {
        type: 'matches',
      },
    });
    const match = result.Item?.data?.find?.((x: any) => x.id === '1-1');
    return {
      kills: match?.kills,
      deaths: match?.deaths,
      ratio: Object.entries(match?.kills ?? {}).reduce((acc, [key, value]) => {
        return {
          ...acc,
          [key]: Math.trunc(((value as number) / (match?.deaths?.[key] ?? 1)) * 100) / 100
        }
      }, {}),
      victoryPoints: match?.victory_points
    }
  }),
});
