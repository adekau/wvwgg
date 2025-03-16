import { cookies } from 'next/headers';

export const DEFAULT_LAYOUT = [10, 24, 66];
export const DEFAULT_SELECTED_MATCH_FILTER = 'all';
export const DEFAULT_BOOKMARKED_GUILDS = [];

export async function getUserPreferences() {
    const cookiesStore = await cookies();
    const collapsed = cookiesStore.get('react-resizable-panels:collapsed');
    const layout = cookiesStore.get('react-resizable-panels:layout:wvwgg');
    const selectedMatchFilter = cookiesStore.get('selected-match-filter');
    const bookmarkedGuilds = cookiesStore.get('bookmarkedGuilds');

    const parsedCollapsed = collapsed ? JSON.parse(collapsed.value) : false;
    const parsedLayout = layout ? JSON.parse(layout.value) : DEFAULT_LAYOUT;
    const parsedSelectedMatchFilter = selectedMatchFilter ? JSON.parse(selectedMatchFilter.value) : DEFAULT_SELECTED_MATCH_FILTER;
    const parsedBookmarkedGuilds = bookmarkedGuilds ? JSON.parse(bookmarkedGuilds.value) : DEFAULT_BOOKMARKED_GUILDS;
    return {
        collapsed: parsedCollapsed,
        layout: parsedLayout,
        selectedMatchFilter: parsedSelectedMatchFilter,
        bookmarkedGuilds: parsedBookmarkedGuilds
    };
}
