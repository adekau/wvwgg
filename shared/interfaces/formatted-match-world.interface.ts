import { IWorld } from './world.interface';

export interface IFormattedMatchWorld {
    world: IWorld;
    kills: number;
    deaths: number;
    activity: number;
    ratio: number;
    victoryPoints: number;
    skirmishScore: number;
}