'use client';
import { bookmarkedGuildsAtom } from '@/app/providers/guilds-atom';
import { Button } from '@/components/ui/button';
import { useAtom } from 'jotai';
import { BookmarkMinus } from 'lucide-react';

export default function RemoveBookmarkButton({ guildId }: { guildId: string }) {
    const [bookmarkedGuilds, setBookmarkedGuilds] = useAtom(bookmarkedGuildsAtom);

    const removeBookmarkedGuild = (guildId: string) => {
        setBookmarkedGuilds(bookmarkedGuilds.filter((id) => id !== guildId));
    };

    return (
        <Button onClick={() => removeBookmarkedGuild(guildId)} variant="ghost" size="sm">
            <BookmarkMinus />
        </Button>
    );
}
