import type { ReactNode } from "react"

interface SidebarSectionProps {
  title?: string
  children: ReactNode
}

export function SidebarSection({ title, children }: SidebarSectionProps) {
  return (
    <div className="py-2">
      {title && <h3 className="px-3 mb-1 text-xs font-semibold text-muted-foreground tracking-wider">{title}</h3>}
      <div className="space-y-1">{children}</div>
    </div>
  )
}
