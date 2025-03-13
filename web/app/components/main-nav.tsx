'use client';
import { ResizablePanel } from '@/components/ui/resizable';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { ClockIcon, ShieldIcon, SwordsIcon, Trophy } from 'lucide-react';
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
                            variant: 'logo'
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
                        variant: 'default'
                    },
                    {
                        title: 'Guilds',
                        icon: ShieldIcon,
                        variant: 'ghost'
                    },
                    {
                        title: 'Timezones',
                        icon: ClockIcon,
                        variant: 'ghost'
                    }
                ]}
            />
        </ResizablePanel>
    );
}
