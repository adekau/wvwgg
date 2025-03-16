'use client';
import { Button } from '@/components/ui/button';
import { IFormattedGuild } from '@shared/interfaces/formatted-guild.interface';
import { IFormattedMatch } from '@shared/interfaces/formatted-match.interface';
import { ColumnDef } from '@tanstack/react-table';
import { BookmarkMinus, BookmarkPlus } from 'lucide-react';

export interface IGuildTableRow extends IFormattedGuild {}

export const guildTableColumns: (matches: IFormattedMatch[]) => ColumnDef<IGuildTableRow>[] = (matches) => [
    {
        header: 'Bookmark',
        cell: ({ row }) => {
            return (
                <Button variant="ghost" onClick={() => row.toggleSelected()}>
                    {row.getIsSelected() ? <BookmarkMinus className="w-4 h-4 fill-yellow-500" /> : <BookmarkPlus className="w-4 h-4" />}
                </Button>
            );
        },
        maxSize: 32
    },
    {
        accessorKey: 'tag',
        header: 'Tag'
    },
    {
        accessorKey: 'name',
        header: 'Name'
    },
    {
        accessorFn: (row) => {
            return row.world.name;
        },
        header: 'World'
    },
    {
        accessorFn: (row) => {
            const worldId = row.world.id;
            const match = Object.values(matches).find(
                (m) => m.green.world.id === worldId || m.blue.world.id === worldId || m.red.world.id === worldId
            );
            const [region, tier] = match?.id.split('-') ?? [];
            return `${region === '1' ? 'NA' : 'EU'} Tier ${tier}`;
        },
        header: 'Tier'
    }
];
