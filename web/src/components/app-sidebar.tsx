'use client';
import { CommandIcon, Globe, Swords, Trophy, Users } from "lucide-react";
import * as React from "react";
import { Label } from "~/components/ui/label";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/ui/sidebar";
import { Switch } from "~/components/ui/switch";
import { api } from "~/trpc/react";
import { NavUser } from "./nav-user";

const data = {
  user: {
    name: "Commander",
    email: "commander@gw2.com",
    avatar: "/avatars/commander.jpg",
  },
  navMain: [
    {
      title: "Matches",
      url: "#",
      icon: Swords,
      isActive: true,
    },
    {
      title: "Leaderboard",
      url: "#",
      icon: Trophy,
      isActive: false,
    },
    {
      title: "Worlds",
      url: "#",
      icon: Globe,
      isActive: false,
    },
    {
      title: "Players",
      url: "#",
      icon: Users,
      isActive: false,
    },
  ],
  matches: {} as any,
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [activeItem, setActiveItem] = React.useState(data.navMain[0])
  const { data: matches } = api.match.getNAMatches.useQuery();

  const { setOpen } = useSidebar()

  return (
    <Sidebar collapsible="icon" className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row" {...props}>
      {/* This is the first sidebar */}
      {/* We disable collapsible and adjust width to icon. */}
      {/* This will make the sidebar appear as icons. */}
      <Sidebar collapsible="none" className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <a href="#">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <CommandIcon className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Acme Inc</span>
                    <span className="truncate text-xs">Enterprise</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {data.navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      onClick={() => {
                        setActiveItem(item)
                        setOpen(true)
                      }}
                      isActive={activeItem?.title === item.title}
                      className="px-2.5 md:px-2"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
      </Sidebar>

      {/* This is the second sidebar */}
      {/* We disable collapsible and let it fill remaining space */}
      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-base font-medium text-foreground">{activeItem?.title}</div>
            <Label className="flex items-center gap-2 text-sm">
              <span>Live Updates</span>
              <Switch className="shadow-none" />
            </Label>
          </div>
          <SidebarInput placeholder="Search matches..." />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="px-0">
            <SidebarGroupContent>
              {Object.values(matches ?? {}).map((match: any) => (
                <MatchSummary key={match.id} match={match} />
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  )
}

function MatchSummary({ match }: { match: any }) {
  return (
    <a
      href="#"
      className="flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
    >
      <div className="flex w-full items-center justify-between">
        <span className="font-medium">Match #{match.id}</span>
        <span className="text-xs">Live</span>
      </div>
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
    </a>
  )
}

