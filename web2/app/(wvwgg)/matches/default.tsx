import { cookies } from "next/headers";
import { mails } from "../../data";
import MatchesPanel from "./components/matches-panel";

export default async function MatchesDefaultPage() {
  const cookiesStore = await cookies();
  const layout = cookiesStore.get("react-resizable-panels:layout:wvwgg")
  const defaultLayout = layout ? JSON.parse(layout.value) : undefined
  console.log(layout);

  return (
    <MatchesPanel defaultLayout={defaultLayout} mails={mails} />
  )
}

