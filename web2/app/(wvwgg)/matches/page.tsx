import { cookies } from "next/headers";
import MatchesPanel from "./components/matches-panel";

export default async function MailPage() {
  const cookiesStore = await cookies();
  const layout = cookiesStore.get("react-resizable-panels:layout:wvwgg")
  const defaultLayout = layout ? JSON.parse(layout.value) : undefined

  return (
    <MatchesPanel defaultLayout={defaultLayout} />
  )
}
