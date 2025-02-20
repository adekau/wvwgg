import { api } from "~/trpc/server";
import MatchSidebar from "../../../_components/match-sidebar";

export default async function MatchIdSidebar({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const matches = await api.match.getNAMatches();
    return <MatchSidebar matches={matches} activeMatchId={id} />
}
