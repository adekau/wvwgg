import { api } from "~/trpc/server";
import { getMatches } from "~/server/api/routers/match";

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
    const matches = await getMatches();
    
    return Object.keys(matches).map((matchId) => ({
        id: matchId
    }));
}

export default async function MatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const matches = await api.match.getNAMatches();
  const match = matches[id];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <pre className="w-full rounded-lg bg-muted/50 p-4">
        {JSON.stringify(match, null, 2)} a
      </pre>
    </div>
  );
}
