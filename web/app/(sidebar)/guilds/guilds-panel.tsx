'use client';
import { bookmarkedGuildsAtom } from '@/app/providers/guilds-atom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResizablePanel } from '@/components/ui/resizable';
import { Separator } from '@/components/ui/separator';
import { IFormattedGuild } from '@shared/interfaces/formatted-guild.interface';
import { IFormattedMatch } from '@shared/interfaces/formatted-match.interface';
import { useAtomValue } from 'jotai';
import { Shield } from 'lucide-react';
import Link from 'next/link';
import RemoveBookmarkButton from './remove-bookmark-button';

export default function GuildsPanel({
    guilds,
    matches,
    layout
}: {
    guilds: IFormattedGuild[];
    matches: IFormattedMatch[];
    layout: number[];
}) {
    const bookmarkedGuilds = useAtomValue(bookmarkedGuildsAtom);

    return (
        <ResizablePanel className="bg-sidebar" defaultSize={layout[1]} collapsible={true} collapsedSize={0} minSize={22} maxSize={32}>
            <div className="flex items-center px-4 py-2 h-[52px]">
                <h1 className="text-xl font-bold flex">
                    <Shield className="mr-2 pt-1" />
                    <span>Guilds</span>
                </h1>
            </div>
            <Separator className="mb-2" />
            <div className="flex flex-col gap-2 p-2">
                <p className="text-sm font-medium">Bookmarked Guilds</p>
                {bookmarkedGuilds.length > 0 ? (
                    bookmarkedGuilds.map((guildId) => {
                        const guild = guilds.find((g) => g.id === guildId);
                        if (!guild) return null;
                        const match = matches.find(
                            (m) =>
                                m.green.world.id === guild.world.id ||
                                m.blue.world.id === guild.world.id ||
                                m.red.world.id === guild.world.id
                        );
                        return (
                            <Card key={guildId}>
                                <CardHeader className="flex flex-row items-center justify-between px-4 py-2">
                                    <CardTitle>
                                        [{guild.tag}] {guild.name}
                                    </CardTitle>
                                    <RemoveBookmarkButton guildId={guildId} />
                                </CardHeader>
                                <CardContent className="px-4">
                                    <p>{guild.world.name}</p>
                                    <TierInfo match={match} />
                                </CardContent>
                            </Card>
                        );
                    })
                ) : (
                    <p className="text-sm font-medium text-muted-foreground">No bookmarked guilds.</p>
                )}
            </div>
        </ResizablePanel>
    );
}

function TierInfo({ match }: { match?: IFormattedMatch }) {
    if (!match) return null;
    const [region, tier] = match.id.split('-');
    const regionName = region === '1' ? 'NA' : 'EU';
    return (
        <Link href={`/matches/${match.id}`} className="text-sm text-muted-foreground hover:text-foreground">
            {regionName} Tier {tier}
        </Link>
    );
}
