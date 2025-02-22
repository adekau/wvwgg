import { MatchDisplay } from "@/app/components/match-display";
import { ResizablePanel } from "@/components/ui/resizable";
import { cookies } from "next/headers";

export default async function MatchIdContent({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const cookiesStore = await cookies();
    const layout = cookiesStore.get("react-resizable-panels:layout:wvwgg")
    const defaultLayout = layout ? JSON.parse(layout.value) : [10, 24, 64];

    return (
        <ResizablePanel defaultSize={defaultLayout[2]} minSize={30}>
            <MatchDisplay
                matchId={id}
            />
        </ResizablePanel>
    )
}