import { IFormattedMatch } from "../interfaces/formatted-match.interface";
import { MatchId } from "../interfaces/match-id.type";
import { IWorld } from "../interfaces/world.interface";
import { getAllianceWorld } from "./get-alliance-world";
import { IMatchResponse } from '../interfaces/match-response.interface';

export function formatMatches(matches: IMatchResponse[], worlds: IWorld[]): Record<MatchId, IFormattedMatch> {
    return matches.reduce((acc: Record<string, IFormattedMatch>, match: IMatchResponse) => {
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
                    kills: match.kills.red,
                    deaths: match.deaths.red,
                    activity: match.kills.red + match.deaths.red,
                    ratio: Math.trunc(((match.kills.red) / (match.deaths.red)) * 100) / 100,
                    victoryPoints: match.victory_points.red,
                    skirmishScore: match.skirmishes ? match.skirmishes[match.skirmishes.length - 1].scores.red : 0
                },
                blue: {
                    world: blueWorld,
                    kills: match.kills.blue,
                    deaths: match.deaths.blue,
                    activity: match.kills.blue + match.deaths.blue,
                    ratio: Math.trunc(((match.kills.blue) / (match.deaths.blue)) * 100) / 100,
                    victoryPoints: match.victory_points.blue,
                    skirmishScore: match.skirmishes ? match.skirmishes[match.skirmishes.length - 1].scores.blue : 0
                },
                green: {
                    world: greenWorld,
                    kills: match.kills.green,
                    deaths: match.deaths.green,
                    activity: match.kills.green + match.deaths.green,
                    ratio: Math.trunc(((match.kills.green) / (match.deaths.green)) * 100) / 100,
                    victoryPoints: match.victory_points.green,
                    skirmishScore: match.skirmishes ? match.skirmishes[match.skirmishes.length - 1].scores.green : 0
                }
            } satisfies IFormattedMatch
        }
    }, {});
}