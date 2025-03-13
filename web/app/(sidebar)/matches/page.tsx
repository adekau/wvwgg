import { getUserPreferences } from '../../../util/user-preferences';
import MatchesPanel from './components/matches-panel';

export default async function MatchesSidebar() {
    const { layout, selectedMatchFilter } = await getUserPreferences();

    return <MatchesPanel layout={layout} selectedMatchFilter={selectedMatchFilter} />;
}
