import { ResizablePanel } from "@/components/ui/resizable";
import { cookies } from "next/headers";

export default async function MatchesContent({ params }: { params: Promise<{ id: string }> }) {
    const cookiesStore = await cookies();
    const layout = cookiesStore.get("react-resizable-panels:layout:wvwgg")
    const defaultLayout = layout ? JSON.parse(layout.value) : undefined
    return (
        <ResizablePanel defaultSize={defaultLayout[2]} minSize={30}>
            <div>Matches</div>
        </ResizablePanel>
    );
}