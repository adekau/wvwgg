import { api } from "~/trpc/server";
import MatchSidebar from "../_components/match-sidebar";

export default async function Sidebar() {
    const matches = await api.match.getNAMatches();
    return <MatchSidebar matches={matches} />
}
