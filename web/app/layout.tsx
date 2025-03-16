import { ResizableHandle } from '@/components/ui/resizable';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Provider as JotaiProvider } from 'jotai';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { getMatches, getWorlds } from '../server/queries';
import { getUserPreferences } from '../util/user-preferences';
import { MainLayout } from './components/main-layout';
import { MainNav } from './components/main-nav';
import { ThemeProvider } from './components/theme-provider';
import './globals.css';
import MatchesProvider from './providers/matches-provider';
import WorldsProvider from './providers/worlds-provider';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin']
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin']
});

export const metadata: Metadata = {
    title: 'WvW.gg',
    description: 'All things World vs World related'
};

export default async function RootLayout({
    children,
    content
}: Readonly<{
    children: React.ReactNode;
    content: React.ReactNode;
}>) {
    const { layout, collapsed } = await getUserPreferences();
    const matches = await getMatches();
    const worlds = await getWorlds();

    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}>
                <JotaiProvider>
                    <MatchesProvider matches={matches ?? {}} />
                    <WorldsProvider worlds={worlds ?? []} />

                    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                        <TooltipProvider delayDuration={0}>
                            <MainLayout>
                                <MainNav defaultLayout={layout} navCollapsedSize={1} defaultCollapsed={collapsed} />
                                <ResizableHandle withHandle />
                                {children}
                                <ResizableHandle withHandle />
                                {content}
                            </MainLayout>
                        </TooltipProvider>
                    </ThemeProvider>
                </JotaiProvider>
            </body>
        </html>
    );
}
