"use client"
import { Input } from "@/components/ui/input"
import {
    ResizableHandle,
    ResizablePanel
} from "@/components/ui/resizable"
import { Separator } from "@/components/ui/separator"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    Search
} from "lucide-react"
import * as React from "react"
import { type Mail } from "../data"
import { useMail } from "../use-mail"
import { MailDisplay } from "./mail-display"
import { MailList } from "./mail-list"

interface MailProps {
    mails: Mail[]
    defaultLayout: number[]
}

export function Mail({
    mails,
    defaultLayout = [10, 24, 66]
}: MailProps) {
    const [mail] = useMail()

    return (
        <>
        </>
    )
}
