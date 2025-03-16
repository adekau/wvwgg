'use client';
import { Button } from '@/components/ui/button';
import { IFormattedGuild } from '@shared/interfaces/formatted-guild.interface';
import { ColumnDef } from '@tanstack/react-table';
import { BookmarkMinus, BookmarkPlus } from 'lucide-react';

export interface IGuildTableRow extends IFormattedGuild {}

export const guildTableColumns: ColumnDef<IGuildTableRow>[] = [
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
    }
];
