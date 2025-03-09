import { MatchId } from "./match-id.type";
import { IRedBlueGreen } from "./red-blue-green.interface";

export interface IMatchResponse {
    id: MatchId;
    start_time: string;
    end_time: string;
    worlds: IRedBlueGreen<number>;
    all_worlds: IRedBlueGreen<number[]>;
    deaths: IRedBlueGreen<number>;
    kills: IRedBlueGreen<number>;
    victory_points: IRedBlueGreen<number>;
    skirmishes: IMatchSkirmish[];
    maps: IMatchMap[];
}

export interface IMatchSkirmish {
    id: number;
    scores: IRedBlueGreen<number>;
    map_scores: IMatchMapScore[];
}

export type MapType = 'RedHome' | 'BlueHome' | 'GreenHome' | 'Center';
export interface IMatchMapScore {
    type: MapType;
    scores: IRedBlueGreen<number>;
}

export interface IMatchMap {
    id: number;
    type: MapType;
    bonuses: IMatchMapBonus[]
    objectives: IMatchMapObjective[];
    scores: IRedBlueGreen<number>;
    kills: IRedBlueGreen<number>;
    deaths: IRedBlueGreen<number>;
}

export type BonusType = 'Bloodlust';
export interface IMatchMapBonus {
    type: BonusType;
    owner: string;
}

export type ObjectiveType = 'Spawn' | 'Camp' | 'Ruin' | 'Tower' | 'Keep' | 'Castle' | 'Mercenary';
export type ObjectiveOwner = 'Red' | 'Blue' | 'Green' | 'Neutral';
export interface IMatchMapObjective {
    id: string;
    type: ObjectiveType;
    owner: ObjectiveOwner;
    last_flipped: string;
    claimed_by?: string;
    claimed_at?: string;
    points_tick: number;
    points_capture: number;
    guild_upgrades?: number[];
    yaks_delivered?: number;
}