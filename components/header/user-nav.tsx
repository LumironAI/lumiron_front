"use client"

import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserDropdown } from "@/components/header/user-dropdown"
import { useAuth } from "@/contexts/auth-context"
import { ThemeToggle } from "@/components/theme-toggle"

export function UserNav() {
  const { user } = useAuth()

  return (
    <div className="flex items-center gap-4">
      {/* Add theme toggle for mobile/tablet view */}
      <div className="md:hidden">
        <ThemeToggle showLabel={false} />
      </div>
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="w-5 h-5" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      </Button>
      <UserDropdown />
    </div>
  )
}
