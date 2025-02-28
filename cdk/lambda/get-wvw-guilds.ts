import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { IWvwGuildsResponse } from "../../shared/interfaces/wvw-guilds-response.interface";

interface IGetWvwGuildsEvent {
    wvwRegion: string;
    fileName?: string;
}

const REGION = process.env.REGION;
const WVW_GUILDS_ENDPOINT = process.env.WVW_GUILDS_ENDPOINT;
const BUCKET_NAME = process.env.BUCKET_NAME;
const s3Client = new S3Client({ region: REGION });

export const handler = async (event: IGetWvwGuildsEvent) => {
    const { wvwRegion, fileName } = event;

    const guilds: IWvwGuildsResponse = await fetch(`${WVW_GUILDS_ENDPOINT}/${wvwRegion}`).then(res => res.json());

    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName ?? `${wvwRegion}.json`,
        Body: JSON.stringify(guilds)
    });

    await s3Client.send(command);

    // start with 100 guilds to test
    // const guildEntries = Object.entries(guilds).slice(0, 100);
    // for (let i = 0; i < guildEntries.length; i += 25) {
    //     const batch = guildEntries.slice(i, i + 25);
    //     await dynamoDb.batchWrite({
    //         RequestItems: {
    //             [tableNames[0]]: batch.map(([guildId, allianceWorldId]) => {
    //                 return {
    //                     PutRequest: {
    //                         Item: {
    //                             type: 'guild',
    //                             id: guildId,
    //                             data: {
    //                                 allianceWorldId
    //                             },
    //                             updatedAt: Date.now()
    //                         }
    //                     }
    //                 }
    //             })
    //         }
    //     });
    // }
    return {
        statusCode: 200,
        body: JSON.stringify({ count: Object.keys(guilds).length })
    };
}