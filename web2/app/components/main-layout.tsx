'use client';
import { ResizablePanelGroup } from "@/components/ui/resizable";

export function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <ResizablePanelGroup
            direction="horizontal"
            onLayout={(sizes: number[]) => {
                document.cookie = `react-resizable-panels:layout:wvwgg=${JSON.stringify(
                    sizes
                )}`
            }}
            className="h-full items-stretch"
        >
            {children}
        </ResizablePanelGroup>
    )
}