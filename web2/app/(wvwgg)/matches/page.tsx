import { cookies } from "next/headers";
import MatchesPanel from "./components/matches-panel";

export default async function MatchesPage() {
  const cookiesStore = await cookies();
  const layout = cookiesStore.get("react-resizable-panels:layout:wvwgg")
  const defaultLayout = layout ? JSON.parse(layout.value) : [10, 24, 64];

  return (
    <MatchesPanel defaultLayout={defaultLayout} />
  )
}
