import { api } from "~/trpc/server";
import MatchSummaryLink from "../../_components/match-summary-link";
import RouteSidebarContent from "../../_components/route-sidebar-content";

export default async function MatchesSidebar() {
    const matches = await api.match.getNAMatches();

    return (
        <RouteSidebarContent>
            {Object.values(matches ?? {}).map((match: any) => (
                <MatchSummaryLink key={match.id} match={match} />
            ))}
        </RouteSidebarContent>
    );
}

