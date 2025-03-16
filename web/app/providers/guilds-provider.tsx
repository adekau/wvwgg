'use client';
import { IFormattedGuild } from '@shared/interfaces/formatted-guild.interface';
import { useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { bookmarkedGuildsAtom, guildsAtom } from './guilds-atom';

export default function GuildsProvider({ guilds, bookmarkedGuilds }: { guilds: IFormattedGuild[]; bookmarkedGuilds: string[] }) {
    const setGuilds = useSetAtom(guildsAtom);
    const setBookmarkedGuilds = useSetAtom(bookmarkedGuildsAtom);

    useEffect(() => {
        if (guilds) {
            setGuilds(guilds);
        }
        if (bookmarkedGuilds) {
            setBookmarkedGuilds(bookmarkedGuilds);
        }
    }, [guilds, bookmarkedGuilds, setGuilds, setBookmarkedGuilds]);

    return null;
}
