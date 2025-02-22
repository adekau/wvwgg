'use client';
import { MailList } from "@/app/components/mail-list";
import { Mail } from "@/app/data";
import { Input } from "@/components/ui/input";
import { ResizablePanel } from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";

export default function MatchesPanel({ defaultLayout, mails }: { defaultLayout: number[], mails: Mail[] }) {
    return (
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={22} maxSize={32}>
            <Tabs defaultValue="all">
                <div className="flex items-center px-4 py-2">
                    <h1 className="text-xl font-bold">Inbox</h1>
                    <TabsList className="ml-auto">
                        <TabsTrigger
                            value="all"
                            className="text-zinc-600 dark:text-zinc-200"
                        >
                            All mail
                        </TabsTrigger>
                        <TabsTrigger
                            value="unread"
                            className="text-zinc-600 dark:text-zinc-200"
                        >
                            Unread
                        </TabsTrigger>
                    </TabsList>
                </div>
                <Separator />
                <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <form>
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search" className="pl-8" />
                        </div>
                    </form>
                </div>
                <TabsContent value="all" className="m-0">
                    <MailList items={mails} />
                </TabsContent>
                <TabsContent value="unread" className="m-0">
                    <MailList items={mails.filter((item) => !item.read)} />
                </TabsContent>
            </Tabs>
        </ResizablePanel>
    );
}