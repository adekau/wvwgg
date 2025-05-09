'use client';
import { ThemeToggle } from '@/app/components/theme-toggle';
import { matchesAtom, selectedMatchAtom } from '@/app/providers/matches-atom';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { MatchId } from '@shared/interfaces/match-id.type';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect } from 'react';

interface MatchDisplayProps {
    matchId: MatchId;
}

export function MatchDisplay({ matchId }: MatchDisplayProps) {
    const matches = useAtomValue(matchesAtom);
    const [selectedMatch, setSelectedMatch] = useAtom(selectedMatchAtom);
    const match = matches[matchId];

    useEffect(() => {
        if (selectedMatch !== matchId) {
            setSelectedMatch(matchId);
        }
    }, [matchId, selectedMatch, setSelectedMatch]);

    const splitMatchId = matchId.split('-');
    const naOrEu = splitMatchId[0] === '1' ? 'NA' : 'EU';
    const tier = splitMatchId[1];

    return (
        <div className="flex h-full flex-col overflow-y-auto">
            <div className="flex items-center p-2">
                <div className="flex items-center gap-2 px-2">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/matches">Matches</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href={`/matches/${matchId}`}>
                                    {naOrEu} Tier {tier}
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <div className="ml-auto flex items-center gap-2 px-2">
                    <ThemeToggle />
                </div>
            </div>
            <Separator />
            {match ? (
                <div className="overflow-y-auto p-4 bg-muted rounded-lg m-4">
                    <pre>{JSON.stringify(match, null, 2)}</pre>
                </div>
            ) : (
                <div className="p-4 text-center text-muted-foreground">No match selected</div>
            )}
        </div>
    );
}
