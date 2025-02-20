import { api } from "~/trpc/server";
import MatchSummaryLink from "../../../_components/match-summary-link";
import RouteSidebarContent from "../../../_components/route-sidebar-content";

export default async function MatchIdSidebar({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const matches = await api.match.getNAMatches();

    return (
        <RouteSidebarContent>
            {Object.values(matches ?? {}).map((match: any) => (
                <MatchSummaryLink key={match.id} match={match} active={match.id === id} />
            ))}
        </RouteSidebarContent>
    );
}
