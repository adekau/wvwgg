import { ResizableHandle } from "@/components/ui/resizable";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cookies } from "next/headers";
import { MainLayout } from "../components/main-layout";
import { MainNav } from "../components/main-nav";

export default async function WvWGGLayout({ children, content }: { children: React.ReactNode, content: React.ReactNode }) {
    const cookiesStore = await cookies();
    const collapsed = cookiesStore.get("react-resizable-panels:collapsed");
    const layout = cookiesStore.get("react-resizable-panels:layout:wvwgg")
    const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : false;
    const defaultLayout = layout ? JSON.parse(layout.value) : [10, 24, 66];

    return (
        <TooltipProvider delayDuration={0}>
            <MainLayout>
                <MainNav defaultLayout={defaultLayout} navCollapsedSize={1} defaultCollapsed={defaultCollapsed} />
                <ResizableHandle withHandle />
                {children}
                <ResizableHandle withHandle />
                {content}
            </MainLayout>
        </TooltipProvider>
    )
}