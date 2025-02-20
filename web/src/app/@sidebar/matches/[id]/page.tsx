import { api } from "~/trpc/server";
import MatchSidebar from "../../../_components/match-sidebar";
import { getMatches } from "~/server/api/routers/match";

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
    const matches = await getMatches();

    return Object.keys(matches).map((matchId) => ({
        id: matchId
    }));
}

export default async function MatchIdSidebar({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const matches = await api.match.getNAMatches();
    return <MatchSidebar matches={matches} activeMatchId={id} />
}
