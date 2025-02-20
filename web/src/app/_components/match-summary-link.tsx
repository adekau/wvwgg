import Link from "next/link";
import { cn } from "~/lib/utils";

export default function MatchSummaryLink({ match, active = false }: { match: any, active?: boolean }) {
    return (
        <Link prefetch={true} href={`/matches/${match.id}`} className={cn("flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground", active && "bg-sidebar-accent text-sidebar-accent-foreground")}>
            <div className="flex w-full items-center justify-between">
                <span className="font-medium">Match #{match.id}</span>
                <span className="text-xs">Live</span>
            </div>
            <div className="flex w-full justify-between">
                <div className="flex flex-col items-start">
                    <span className="text-red-500 dark:text-red-400">{match.red.world.name}</span>
                    <span className="text-blue-500 dark:text-blue-400">{match.blue.world.name}</span>
                    <span className="text-green-500 dark:text-green-400">{match.green.world.name}</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-red-500 dark:text-red-400">{match.red.skirmishScore} ({match.red.victoryPoints})</span>
                    <span className="text-blue-500 dark:text-blue-400">{match.blue.skirmishScore} ({match.blue.victoryPoints})</span>
                    <span className="text-green-500 dark:text-green-400">{match.green.skirmishScore} ({match.green.victoryPoints})</span>
                </div>
            </div>
        </Link>
    )
}

