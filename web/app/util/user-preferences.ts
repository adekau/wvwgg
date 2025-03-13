import { cookies } from 'next/headers';

export const DEFAULT_LAYOUT = [10, 24, 66];
export const DEFAULT_SELECTED_MATCH_FILTER = 'all';

export async function getUserPreferences() {
    const cookiesStore = await cookies();
    const collapsed = cookiesStore.get('react-resizable-panels:collapsed');
    const layout = cookiesStore.get('react-resizable-panels:layout:wvwgg');
    const selectedMatchFilter = cookiesStore.get('selected-match-filter');

    const parsedCollapsed = collapsed ? JSON.parse(collapsed.value) : false;
    const parsedLayout = layout ? JSON.parse(layout.value) : DEFAULT_LAYOUT;
    const parsedSelectedMatchFilter = selectedMatchFilter ? JSON.parse(selectedMatchFilter.value) : DEFAULT_SELECTED_MATCH_FILTER;

    return {
        collapsed: parsedCollapsed,
        layout: parsedLayout,
        selectedMatchFilter: parsedSelectedMatchFilter
    };
}
