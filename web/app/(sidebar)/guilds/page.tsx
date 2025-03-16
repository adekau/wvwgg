import { getGuilds, getMatches } from '@/server/queries';
import { getUserPreferences } from '@/util/user-preferences';
import GuildsPanel from './guilds-panel';

export default async function GuildsSidebar() {
    const { layout } = await getUserPreferences();
    const guilds = await getGuilds();
    const matches = await getMatches();

    return <GuildsPanel layout={layout} guilds={guilds ?? []} matches={Object.values(matches ?? {})} />;
}
