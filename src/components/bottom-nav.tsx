"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Receipt, Beef } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  {
    href: "/",
    label: "Dashboard",
    icon: Home,
  },
  {
    href: "/transactions",
    label: "Transactions",
    icon: Receipt,
  },
  {
    href: "/meat-distribution",
    label: "Meat Distribution",
    icon: Beef,
  },
]

export function BottomNav() {
  const pathname = usePathname()

  // Don't show bottom nav on member detail pages
  if (pathname.startsWith("/member/")) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden">
      <nav className="flex items-center justify-around h-16 px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-0 flex-1",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
              <span className={cn("text-xs font-medium truncate", isActive && "text-primary")}>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
