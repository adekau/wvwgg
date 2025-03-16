import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dispatch, SetStateAction } from 'react';

export interface GuildSearchProps {
    filterColumn: string;
    setFilterColumn: Dispatch<SetStateAction<string>>;
    searchGuildsValue: string;
    setSearchGuildsValue: Dispatch<SetStateAction<string>>;
}

export default function GuildSearch({ filterColumn, setFilterColumn, searchGuildsValue, setSearchGuildsValue }: GuildSearchProps) {
    return (
        <div className="flex items-center gap-2">
            <p className="text-sm font-medium w-[120px]">Search by</p>
            <Select value={filterColumn} onValueChange={setFilterColumn}>
                <SelectTrigger className="h-8 w-[120px]">
                    <SelectValue placeholder="Search by" />
                </SelectTrigger>
                <SelectContent side="top">
                    {['tag', 'name'].map((column) => (
                        <SelectItem key={column} value={column}>
                            Guild {column.charAt(0).toUpperCase() + column.slice(1)}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Input
                placeholder="Search guilds..."
                value={searchGuildsValue}
                onChange={(event) => setSearchGuildsValue(event.target.value)}
                className="max-w-sm"
            />
        </div>
    );
}
