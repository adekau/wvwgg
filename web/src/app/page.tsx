import { api } from "~/trpc/server";

export default async function Page() {
  const data = await api.match.getNAMatches();

  return (
    <>
      {Object.entries(data).map(([key, match]) => (<div key={key} className="flex flex-1 flex-col gap-4 p-4">
        <pre className="w-full rounded-lg bg-muted/50 p-4">
          {JSON.stringify(match, null, 2)}
        </pre>
      </div>))}
    </>
  )
}
