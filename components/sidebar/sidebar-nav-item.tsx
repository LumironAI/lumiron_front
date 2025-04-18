import type { ReactNode } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface SidebarNavItemProps {
  icon: ReactNode
  label: string
  href: string
  isActive?: boolean
  indent?: boolean
}

export function SidebarNavItem({ icon, label, href, isActive = false, indent = false }: SidebarNavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
        indent ? "pl-10" : "",
        isActive ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
      )}
    >
      <span className="w-5 h-5">{icon}</span>
      <span>{label}</span>
    </Link>
  )
}
