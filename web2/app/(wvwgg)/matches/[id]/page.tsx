import MatchesPage from "../page";
import { getMatches } from '../../../../server/queries';

export const dynamicParams = false;

export async function generateStaticParams() {
    const matches = await getMatches();

    return matches.map((match: any) => ({
        id: match.id,
    }));
}

export default function MatchIdPage() {
    return <MatchesPage />;
}