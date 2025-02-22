'use client';
import { MatchList } from "@/app/components/match-list";
import { useMatches } from "@/app/providers/matches-atom";
import { ResizablePanel } from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MatchesPanel({ defaultLayout }: { defaultLayout: number[] }) {
    const [matches] = useMatches();
    return (
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={22} maxSize={32}>
            <Tabs defaultValue="all">
                <div className="flex items-center px-4 py-2 h-[52px]">
                    <h1 className="text-xl font-bold">Matches</h1>
                    <TabsList className="ml-auto">
                        <TabsTrigger
                            value="all"
                            className="text-zinc-600 dark:text-zinc-200"
                        >
                            All matches
                        </TabsTrigger>
                        <TabsTrigger
                            value="na"
                            className="text-zinc-600 dark:text-zinc-200"
                        >
                            NA
                        </TabsTrigger>
                        <TabsTrigger
                            value="eu"
                            className="text-zinc-600 dark:text-zinc-200"
                        >
                            EU
                        </TabsTrigger>
                    </TabsList>
                </div>
                <Separator className="mb-2" />
                <TabsContent value="all" className="m-0">
                    <MatchList matches={Object.values(matches)} />
                </TabsContent>
                <TabsContent value="na" className="m-0">
                    <MatchList matches={Object.values(matches).filter((match: any) => match.id.startsWith("1"))} />
                </TabsContent>
                <TabsContent value="eu" className="m-0">
                    <MatchList matches={Object.values(matches).filter((match: any) => match.id.startsWith("2"))} />
                </TabsContent>
            </Tabs>
        </ResizablePanel>
    );
}