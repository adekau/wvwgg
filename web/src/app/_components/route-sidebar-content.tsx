import { Label } from "~/components/ui/label";
import {
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarInput
} from "~/components/ui/sidebar";
import { Switch } from "~/components/ui/switch";

export default function RouteSidebarContent({ children }: { children: React.ReactNode }) {
    return (
        <>
            <SidebarHeader className="gap-3.5 border-b p-4">
                <div className="flex w-full items-center justify-between">
                    <div className="text-base font-medium text-foreground">Matches</div>
                    <Label className="flex items-center gap-2 text-sm">
                        <span>Live Updates</span>
                        <Switch className="shadow-none" />
                    </Label>
                </div>
                <SidebarInput placeholder="Search matches..." />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup className="px-0">
                    <SidebarGroupContent>
                        {children}
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </>
    )
}