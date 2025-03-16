import GuildsProvider from '@/app/providers/guilds-provider';
import { getGuilds } from '@/server/queries';
import { getUserPreferences } from '@/util/user-preferences';

export default async function GuildsContentLayout({ children }: { children: React.ReactNode }) {
    const guilds = await getGuilds();
    const { bookmarkedGuilds } = await getUserPreferences();

    return (
        <>
            <GuildsProvider guilds={guilds ?? []} bookmarkedGuilds={bookmarkedGuilds ?? []} />
            {children}
        </>
    );
}
