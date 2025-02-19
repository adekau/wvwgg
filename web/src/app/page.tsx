import { AppSidebar } from "~/components/app-sidebar"
import { ThemeToggle } from "~/components/theme-toggle"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb"
import { Separator } from "~/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar"
import { api } from "~/trpc/server"

export default async function Page() {
  const data = await api.match.getNAMatches();

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "350px",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb className="flex-1">
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">All Inboxes</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Inbox</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <ThemeToggle />
        </header>
        {Object.entries(data).map(([key, match]) => (<div key={key} className="flex flex-1 flex-col gap-4 p-4">
          <pre className="w-full rounded-lg bg-muted/50 p-4">
            {JSON.stringify(match, null, 2)}
          </pre>
        </div>))}
      </SidebarInset>
    </SidebarProvider>
  )
}
