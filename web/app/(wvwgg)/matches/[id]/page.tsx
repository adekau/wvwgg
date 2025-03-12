import MatchesPage from "../page";
import { getMatches } from '../../../../server/queries';
import { IFormattedMatch } from "@shared/interfaces/formatted-match.interface";

export const dynamicParams = false;

export async function generateStaticParams() {
    const matches = await getMatches();

    return Object.values(matches ?? {}).map((match: IFormattedMatch) => ({
        id: match.id,
    }));
}

export default function MatchIdPage() {
    return <MatchesPage />;
}