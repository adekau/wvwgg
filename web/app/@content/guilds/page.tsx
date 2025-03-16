import { ThemeToggle } from '@/app/components/theme-toggle';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from '@/components/ui/breadcrumb';
import { ResizablePanel } from '@/components/ui/resizable';
import { Separator } from '@/components/ui/separator';
import { getAllianceWorlds, getGuilds } from '@/server/queries';
import { getUserPreferences } from '@/util/user-preferences';
import GuildTable from './guild-table';

export default async function GuildsContent() {
    const { layout } = await getUserPreferences();
    const guilds = await getGuilds();
    const worlds = getAllianceWorlds();

    return (
        <ResizablePanel className="h-full" defaultSize={layout[2]} minSize={30}>
            <div className="flex h-full flex-col">
                <div className="flex items-center p-2">
                    <div className="flex items-center gap-2 px-2">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/guilds">Guilds</BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div className="ml-auto flex items-center gap-2 px-2">
                        <ThemeToggle />
                    </div>
                </div>
                <Separator />
                <main className="m-4 h-screen overflow-y-auto">
                    <GuildTable guilds={guilds ?? []} worlds={worlds ?? []} />
                </main>
            </div>
        </ResizablePanel>
    );
}
