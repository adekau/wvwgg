import { ResizableHandle } from "@/components/ui/resizable";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MainLayout } from "../components/main-layout";
import { MainNav } from "../components/main-nav";
import { getUserPreferences } from "../util/user-preferences";

export default async function WvWGGLayout({ children, content }: { children: React.ReactNode, content: React.ReactNode }) {
    const { collapsed, layout } = await getUserPreferences();

    return (
        <TooltipProvider delayDuration={0}>
            <MainLayout>
                <MainNav defaultLayout={layout} navCollapsedSize={1} defaultCollapsed={collapsed} />
                <ResizableHandle withHandle />
                {children}
                <ResizableHandle withHandle />
                {content}
            </MainLayout>
        </TooltipProvider>
    )
}