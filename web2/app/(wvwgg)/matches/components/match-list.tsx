import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useAtom } from "jotai"
import Link from "next/link"
import { selectedMatchAtom } from "../../../providers/matches-atom"

interface MatchListProps {
  matches: any
}

export function MatchList({ matches }: MatchListProps) {
  const [selectedMatch, setSelectedMatch] = useAtom(selectedMatchAtom);

  return (
      <div className="h-screen flex flex-col gap-2 p-4 pt-0 overflow-y-auto">
        {matches.sort((a: any, b: any) => {
          const naOrEu = a.id.startsWith("1") ? -100 : 100;
          const tier = a.id.split('-')[1] - b.id.split('-')[1];
          return naOrEu - tier;
        }).map((match: any) => {
          return (
            <Link
              key={match.id}
              href={`/matches/${match.id}`}
              className={cn(
                "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                selectedMatch === match.id && "bg-muted"
              )}
              onClick={() =>
                setSelectedMatch(match.id)
              }
            >
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
              <div className="flex items-center gap-2">
                <Badge variant='secondary'>
                  Tier {match.id.split("-")[1]}
                </Badge>
              </div>
            </Link>
          )
        })}
      </div>
  )
}
