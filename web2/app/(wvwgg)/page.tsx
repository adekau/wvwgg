import { cookies } from "next/headers"
import Image from "next/image"

import { Mail } from "../components/mail"
import { mails } from "../data"

export default async function MailPage() {
  const cookiesStore = await cookies();
  const layout = cookiesStore.get("react-resizable-panels:layout:mail")

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined

  return (
        <Mail
          mails={mails}
          defaultLayout={defaultLayout}
        />
  )
}
