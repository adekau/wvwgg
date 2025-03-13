import { getUserPreferences } from '@/util/user-preferences';
import GuildsPanel from './guilds-panel';

export default async function GuildsSidebar() {
    const { layout } = await getUserPreferences();

    return <GuildsPanel layout={layout} />;
}
