import { getMatches } from '@/server/queries';
import { IFormattedMatch } from '@shared/interfaces/formatted-match.interface';
import MatchesPage from '../page';

export const dynamicParams = false;

export async function generateStaticParams() {
    const matches = await getMatches();

    return Object.values(matches ?? {}).map((match: IFormattedMatch) => ({
        id: match.id
    }));
}

export default function MatchIdPage() {
    return <MatchesPage />;
}
