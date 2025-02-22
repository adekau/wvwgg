'use client';
import { Separator } from "@/components/ui/separator";
import { useMatches, useSelectedMatch } from "../providers/matches-atom";
import { ThemeToggle } from "./theme-toggle";
import { useEffect } from "react";

interface MatchDisplayProps {
  matchId: string
}

export function MatchDisplay({ matchId }: MatchDisplayProps) {
  const [matches] = useMatches();
  const [selectedMatch, setSelectedMatch] = useSelectedMatch();
  const match = matches[matchId];

  useEffect(() => {
    if (selectedMatch !== matchId) {
      setSelectedMatch(matchId);
    }
  }, [matchId]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center p-2">
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
      <Separator />
      {match ? (
        <div className="p-4 bg-muted rounded-lg m-4">
          <pre>{JSON.stringify(match, null, 2)}</pre>
        </div>
      ) : (
        <div className="p-4 text-center text-muted-foreground">
          No match selected
        </div>
      )}
    </div>
  )
}
