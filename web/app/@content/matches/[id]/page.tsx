import { ResizablePanel } from '@/components/ui/resizable';
import { getUserPreferences } from '@/util/user-preferences';
import { MatchId } from '@shared/interfaces/match-id.type';
import { MatchDisplay } from '../components/match-display';

export default async function MatchIdContent({ params }: { params: Promise<{ id: MatchId }> }) {
    const { id } = await params;
    const { layout } = await getUserPreferences();

    return (
        <ResizablePanel defaultSize={layout[2]} minSize={30}>
            <MatchDisplay matchId={id} />
        </ResizablePanel>
    );
}
