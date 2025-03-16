'use client';
import { selectedMatchAtom } from '@/app/providers/matches-atom';
import { ResizablePanel } from '@/components/ui/resizable';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useAtomValue } from 'jotai';
import { ClockIcon, ShieldIcon, SwordsIcon, Trophy } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Nav } from './nav';

export function MainNav({
    defaultLayout,
    navCollapsedSize,
    defaultCollapsed
}: {
    defaultLayout: [mainNavSize: number, detailSize: number, contentSize: number];
    navCollapsedSize: number;
    defaultCollapsed: boolean;
}) {
    const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
    const selectedMatch = useAtomValue(selectedMatchAtom);
    const pathname = usePathname();

    return (
        <ResizablePanel
            defaultSize={defaultLayout[0]}
            collapsedSize={navCollapsedSize}
            collapsible={true}
            minSize={7}
            maxSize={10}
            onCollapse={() => {
                setIsCollapsed(true);
                document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(true)};path=/`;
            }}
            onResize={() => {
                setIsCollapsed(false);
                document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(false)};path=/`;
            }}
            className={cn('bg-sidebar', isCollapsed && 'min-w-[50px] transition-all duration-300 ease-in-out')}
        >
            <div className={cn('h-[52px]', isCollapsed ? 'h-[52px]' : 'pt-1')}>
                <Nav
                    isCollapsed={isCollapsed}
                    links={[
                        {
                            title: 'WvW.gg',
                            icon: Trophy,
                            variant: 'logo',
                            href: '/'
                        }
                    ]}
                />
            </div>
            <Separator />
            <Nav
                isCollapsed={isCollapsed}
                links={[
                    {
                        title: 'Matches',
                        icon: SwordsIcon,
                        variant: isSelectedNavItem(pathname, '/matches'),
                        href: `/matches${selectedMatch ? `/${selectedMatch}` : ''}`
                    },
                    {
                        title: 'Guilds',
                        icon: ShieldIcon,
                        variant: isSelectedNavItem(pathname, '/guilds'),
                        href: '/guilds'
                    },
                    {
                        title: 'Timezones',
                        icon: ClockIcon,
                        variant: isSelectedNavItem(pathname, '/timezones'),
                        href: '#notimplemented'
                    }
                ]}
            />
        </ResizablePanel>
    );
}

function isSelectedNavItem(pathname: string, href: string) {
    return pathname.includes(href) ? 'default' : 'ghost';
}
