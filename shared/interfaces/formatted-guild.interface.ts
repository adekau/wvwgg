import { IGuild } from "./guild.interface";
import { IWorld } from "./world.interface";

export interface IFormattedGuild extends IGuild {
  world: IWorld;
}
