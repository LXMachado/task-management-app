"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Calendar, FolderKanban, Settings } from "lucide-react"

export function AppSidebar() {
  const pathname = usePathname()

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Calendar", href: "/calendar", icon: Calendar },
    { name: "Projects", href: "/projects", icon: FolderKanban },
    { name: "Settings", href: "/settings", icon: Settings },
  ]

  return (
    <div className="hidden border-r bg-background md:block">
      <div className="flex h-full flex-col gap-2 p-4">
        <Link href="/" className="flex h-14 items-center px-4 mb-4">
          <FolderKanban className="h-6 w-6 mr-2" />
          <span className="font-bold">TaskMaster</span>
        </Link>
        <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center">
          {navigation.map((item) => (
            <Button
              key={item.name}
              variant={pathname === item.href ? "secondary" : "ghost"}
              asChild
              className="justify-start"
            >
              <Link href={item.href} className="flex items-center">
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </div>
  )
}
