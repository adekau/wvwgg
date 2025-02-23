import { MatchDisplay } from "@/app/(wvwgg)/matches/components/match-display";
import { getUserPreferences } from "@/app/util/user-preferences";
import { ResizablePanel } from "@/components/ui/resizable";

export default async function MatchIdContent({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { layout } = await getUserPreferences();

    return (
        <ResizablePanel defaultSize={layout[2]} minSize={30}>
            <MatchDisplay
                matchId={id}
            />
        </ResizablePanel>
    )
}