'use client';
import { DataTablePagination } from '@/app/components/data-table-pagination';
import { bookmarkedGuildsAtom } from '@/app/providers/guilds-atom';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { IFormattedGuild } from '@shared/interfaces/formatted-guild.interface';
import { IFormattedMatch } from '@shared/interfaces/formatted-match.interface';
import { IWorld } from '@shared/interfaces/world.interface';
import {
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    RowSelectionState,
    SortingState,
    useReactTable
} from '@tanstack/react-table';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import GuildSearch from './guild-search';
import { guildTableColumns } from './guild-table-columns';

export default function GuildTable({
    guilds,
    worlds,
    matches
}: {
    guilds: IFormattedGuild[];
    worlds: IWorld[];
    matches: IFormattedMatch[];
}) {
    'use no memo';
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 20
    });
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [filterColumn, setFilterColumn] = useState<string>('name');
    const [searchGuildsValue, setSearchGuildsValue] = useState<string>('');
    const [filterWorld, setFilterWorld] = useState<string>('');
    const [bookmarkedGuilds, setBookmarkedGuilds] = useAtom(bookmarkedGuildsAtom);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>(
        bookmarkedGuilds.length > 0
            ? bookmarkedGuilds.reduce(
                  (acc, id) => {
                      return {
                          ...acc,
                          [id]: true
                      };
                  },
                  {} as Record<string, boolean>
              )
            : {}
    );

    useEffect(() => {
        setRowSelection(
            bookmarkedGuilds.length > 0
                ? bookmarkedGuilds.reduce(
                      (acc, id) => {
                          return {
                              ...acc,
                              [id]: true
                          };
                      },
                      {} as Record<string, boolean>
                  )
                : {}
        );
    }, [bookmarkedGuilds, setRowSelection]);

    const table = useReactTable({
        data: guilds,
        getRowId: (row) => row.id,
        columns: guildTableColumns(matches),
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onPaginationChange: setPagination,
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        onRowSelectionChange: (r) => {
            const next = typeof r === 'function' ? r(rowSelection) : r;
            setRowSelection(next);
            saveBookmarkedGuilds(next);
        },
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            pagination,
            columnFilters,
            rowSelection
        }
    });

    function saveBookmarkedGuilds(next: RowSelectionState) {
        const ids = Object.keys(next);
        setBookmarkedGuilds(ids);
        document.cookie = `bookmarkedGuilds=${JSON.stringify(ids)};path=/`;
    }

    useEffect(() => {
        table.resetColumnFilters(true);
        table.getColumn(filterColumn)?.setFilterValue(searchGuildsValue);
        table.getColumn('World')?.setFilterValue(filterWorld);
    }, [filterColumn, filterWorld, searchGuildsValue]);

    return (
        <div className="max-w-7xl">
            <div className="flex justify-between py-4">
                <GuildSearch
                    filterColumn={filterColumn}
                    setFilterColumn={setFilterColumn}
                    searchGuildsValue={searchGuildsValue}
                    setSearchGuildsValue={setSearchGuildsValue}
                />
                <div className="flex items-center gap-2">
                    <Select
                        value={filterWorld}
                        onValueChange={(value) => {
                            setFilterWorld(value);
                        }}
                    >
                        <SelectTrigger className="h-8">
                            <SelectValue placeholder="Filter by World" />
                        </SelectTrigger>
                        <SelectContent side="top">
                            <SelectGroup>
                                <SelectLabel>North America</SelectLabel>
                                {worlds
                                    .filter((world) => world.id.toString().startsWith('11'))
                                    .map((world) => (
                                        <SelectItem key={world.id} value={world.name}>
                                            {world.name}
                                        </SelectItem>
                                    ))}
                            </SelectGroup>
                            <SelectGroup>
                                <SelectLabel>Europe</SelectLabel>
                                {worlds
                                    .filter((world) => world.id.toString().startsWith('12'))
                                    .map((world) => (
                                        <SelectItem key={world.id} value={world.name}>
                                            {world.name}
                                        </SelectItem>
                                    ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={guildTableColumns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination className="mt-4" table={table} />
        </div>
    );
}
