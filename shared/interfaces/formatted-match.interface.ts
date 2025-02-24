import { IFormattedMatchWorld } from "./formatted-match-world.interface";
import { MatchId } from './match-id.type';

export interface IFormattedMatch {
    id: MatchId;
    red: IFormattedMatchWorld;
    blue: IFormattedMatchWorld;
    green: IFormattedMatchWorld;
}
