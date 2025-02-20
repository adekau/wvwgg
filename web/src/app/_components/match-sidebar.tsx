import MatchSummaryLink from "../_components/match-summary-link";
import RouteSidebarContent from "../_components/route-sidebar-content";

export default function MatchSidebar({ matches, activeMatchId }: { matches: any, activeMatchId?: string }) {
    return (
        <RouteSidebarContent>
            {Object.values(matches ?? {}).map((match: any) => (
                <MatchSummaryLink key={match.id} match={match} active={match.id === activeMatchId} />
            ))}
        </RouteSidebarContent>
    );
}

