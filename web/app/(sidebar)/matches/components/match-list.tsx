import { selectedMatchAtom } from '@/app/providers/matches-atom';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { IFormattedMatch } from '@shared/interfaces/formatted-match.interface';
import { useAtom } from 'jotai';
import Link from 'next/link';

interface MatchListProps {
    matches: IFormattedMatch[];
}

function matchSort(a: IFormattedMatch, b: IFormattedMatch): number {
    const [aRegion, aTier] = a.id.split('-');
    const [bRegion, bTier] = b.id.split('-');
    const aSortNum = parseInt(aRegion, 10) * 100 + parseInt(aTier, 10);
    const bSortNum = parseInt(bRegion, 10) * 100 + parseInt(bTier, 10);

    if (isNaN(aSortNum) || isNaN(bSortNum)) {
        return 0;
    }

    return aSortNum - bSortNum;
}

export function MatchList({ matches }: MatchListProps) {
    const [selectedMatch, setSelectedMatch] = useAtom(selectedMatchAtom);

    return (
        <div className="h-screen flex flex-col pt-0 overflow-y-auto">
            {matches.sort(matchSort).map((match) => {
                return (
                    <Link
                        key={match.id}
                        href={`/matches/${match.id}`}
                        className={cn(
                            'flex flex-col items-start border-b p-3 text-left text-sm transition-all hover:bg-accent',
                            selectedMatch === match.id && 'bg-sidebar-accent'
                        )}
                        onClick={() => setSelectedMatch(match.id)}
                    >
                        <div className="flex w-full justify-between">
                            <div className="flex flex-col items-start">
                                <span className="text-red-500 dark:text-red-400">{match.red.world.name}</span>
                                <span className="text-blue-500 dark:text-blue-400">{match.blue.world.name}</span>
                                <span className="text-green-500 dark:text-green-400">{match.green.world.name}</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-red-500 dark:text-red-400">
                                    {match.red.skirmishScore} ({match.red.victoryPoints})
                                </span>
                                <span className="text-blue-500 dark:text-blue-400">
                                    {match.blue.skirmishScore} ({match.blue.victoryPoints})
                                </span>
                                <span className="text-green-500 dark:text-green-400">
                                    {match.green.skirmishScore} ({match.green.victoryPoints})
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary">Tier {match.id.split('-')[1]}</Badge>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
