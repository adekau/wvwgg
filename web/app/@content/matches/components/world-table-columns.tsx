'use client';
import { Button } from '@/components/ui/button';
import { IFormattedMatchWorld } from '@shared/interfaces/formatted-match-world.interface';
import { MatchId } from '@shared/interfaces/match-id.type';
import { Column, ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { ReactNode } from 'react';

export interface IWorldTableRow extends IFormattedMatchWorld {
    id: MatchId;
}
function formatTier(id: MatchId): `${'NA' | 'EU'}-${string}` {
    const [region, tier] = id.split('-');
    return `${region === '1' ? 'NA' : 'EU'}-${tier}`;
}

function SortButton({ column, children }: { column: Column<IWorldTableRow>; children: ReactNode }) {
    return (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            {children}
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    )
}

export const worldTableColumns: ColumnDef<IWorldTableRow>[] = [
    {
        accessorKey: 'id',
        header: ({ column }) => <SortButton column={column}>Tier</SortButton>,
        cell: ({ row }) => {
            const id: MatchId = (row.getValue('id'));
            return formatTier(id);
        },

    },
    {
        accessorFn: (r) => r.world.name,
        header: 'World'
    },
    {
        accessorKey: 'kills',
        header: ({ column }) => <SortButton column={column}>Kills</SortButton>
    },
    {
        accessorKey: 'deaths',
        header: ({ column }) => <SortButton column={column}>Deaths</SortButton>
    },
    {
        accessorKey: 'activity',
        header: ({ column }) => <SortButton column={column}>Activity</SortButton>
    },
    {
        accessorKey: 'ratio',
        header: ({ column }) => <SortButton column={column}>K/D Ratio</SortButton>
    }
];