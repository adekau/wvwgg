import { ThemeToggle } from "@/app/components/theme-toggle";
import { getUserPreferences } from "@/app/util/user-preferences";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ResizablePanel } from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";

export default async function MatchesContent() {
    const { layout } = await getUserPreferences();

    return (
        <ResizablePanel className="h-full" defaultSize={layout[2]} minSize={30}>
            <div className="flex h-full flex-col overflow-y-auto">
                <div className="flex items-center p-2">
                    <div className="flex items-center gap-2 px-2">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/matches">Matches</BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div className="ml-auto flex items-center gap-2 px-2">
                        <ThemeToggle />
                    </div>
                </div>
                <Separator />
                <div>
                    <span>Matches</span>
                </div>
            </div>
        </ResizablePanel>
    );
}