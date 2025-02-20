import { api } from "~/trpc/server";
import MatchSidebar from "../../_components/match-sidebar";

export default async function MatchesSidebar() {
    const matches = await api.match.getNAMatches();
    return <MatchSidebar matches={matches} />
}
