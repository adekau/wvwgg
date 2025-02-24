'use client';
import { ResizablePanel } from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { CommandIcon, File, Send, SwordsIcon } from "lucide-react";
import { useState } from "react";
import { Nav } from "./nav";

export function MainNav({ defaultLayout, navCollapsedSize, defaultCollapsed }: { defaultLayout: [mainNavSize: number, detailSize: number, contentSize: number], navCollapsedSize: number, defaultCollapsed: boolean }) {
    const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)

    return (
        <ResizablePanel
            defaultSize={defaultLayout[0]}
            collapsedSize={navCollapsedSize}
            collapsible={true}
            minSize={8}
            maxSize={12}
            onCollapse={() => {
                setIsCollapsed(true)
                document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
                    true
                )}`
            }}
            onResize={() => {
                setIsCollapsed(false)
                document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
                    false
                )}`
            }}
            className={cn(
                "bg-sidebar",
                isCollapsed && "min-w-[50px] transition-all duration-300 ease-in-out"
            )}
        >
            <div className={cn("h-[52px]", isCollapsed ? "h-[52px]" : "pt-1")}>
                <Nav isCollapsed={isCollapsed} links={[
                    {
                        title: "wvw.gg",
                        icon: CommandIcon,
                        variant: "logo"
                    }
                ]} />
            </div>
            <Separator />
            <Nav
                isCollapsed={isCollapsed}
                links={[
                    {
                        title: "Matches",
                        label: "128",
                        icon: SwordsIcon,
                        variant: "default",
                    },
                    {
                        title: "Drafts",
                        label: "9",
                        icon: File,
                        variant: "ghost",
                    },
                    {
                        title: "Sent",
                        label: "",
                        icon: Send,
                        variant: "ghost",
                    }
                ]}
            />
        </ResizablePanel>
    )
}