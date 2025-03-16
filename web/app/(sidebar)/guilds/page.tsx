import { getGuilds, getWorlds } from '@/server/queries';
import { getUserPreferences } from '@/util/user-preferences';
import GuildsPanel from './guilds-panel';

export default async function GuildsSidebar() {
    const { layout } = await getUserPreferences();
    const guilds = await getGuilds();
    const worlds = await getWorlds();

    return <GuildsPanel layout={layout} guilds={guilds ?? []} worlds={worlds ?? []} />;
}
