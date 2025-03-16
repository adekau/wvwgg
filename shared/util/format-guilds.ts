import { IFormattedGuild } from "@shared/interfaces/formatted-guild.interface";
import { IGuild } from "@shared/interfaces/guild.interface";
import { IWorld } from "@shared/interfaces/world.interface";

export function formatGuilds(
  guilds: IGuild[],
  worlds: IWorld[]
): IFormattedGuild[] {
  const worldsMap = new Map<number, IWorld>();
  worlds.forEach((world) => {
    worldsMap.set(world.id, world);
  });
  return guilds
    .map((guild) => {
      const world = worldsMap.get(guild.worldId);
      if (!world) {
        console.error(`World not found for guild ${guild.name}`);
        return undefined;
      }
      return {
        ...guild,
        world,
      };
    })
    .filter((x) => x != null);
}
