'use client';
import { MatchList } from '@/app/(sidebar)/matches/components/match-list';
import { matchesAtom } from '@/app/providers/matches-atom';
import { ResizablePanel } from '@/components/ui/resizable';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAtomValue } from 'jotai';
import { Swords } from 'lucide-react';

export default function MatchesPanel({ layout, selectedMatchFilter }: { layout: number[]; selectedMatchFilter: string }) {
    const matches = useAtomValue(matchesAtom);
    return (
        <ResizablePanel className="bg-sidebar" defaultSize={layout[1]} collapsible={true} collapsedSize={0} minSize={22} maxSize={32}>
            <Tabs
                defaultValue={selectedMatchFilter}
                onValueChange={(value) => {
                    document.cookie = `selected-match-filter=${JSON.stringify(value)};path=/`;
                }}
            >
                <div className="flex items-center px-4 py-2 h-[52px]">
                    <h1 className="text-xl font-bold flex">
                        <Swords className="mr-2 pt-1" />
                        <span>Matches</span>
                    </h1>
                    <TabsList className="ml-auto">
                        <TabsTrigger value="all" className="text-zinc-600 dark:text-zinc-200">
                            All
                        </TabsTrigger>
                        <TabsTrigger value="na" className="text-zinc-600 dark:text-zinc-200">
                            NA
                        </TabsTrigger>
                        <TabsTrigger value="eu" className="text-zinc-600 dark:text-zinc-200">
                            EU
                        </TabsTrigger>
                    </TabsList>
                </div>
                <Separator className="mb-2" />
                <TabsContent value="all" className="m-0">
                    <MatchList matches={Object.values(matches)} />
                </TabsContent>
                <TabsContent value="na" className="m-0">
                    <MatchList matches={Object.values(matches).filter((match) => match.id.startsWith('1'))} />
                </TabsContent>
                <TabsContent value="eu" className="m-0">
                    <MatchList matches={Object.values(matches).filter((match) => match.id.startsWith('2'))} />
                </TabsContent>
            </Tabs>
        </ResizablePanel>
    );
}
