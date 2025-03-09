import { IWorld } from "../interfaces/world.interface";

export function getAllianceWorld(worldId: number, worlds: IWorld[]): IWorld | undefined {
    return worlds.find((x) => x.associated_world_id === worldId);
}
