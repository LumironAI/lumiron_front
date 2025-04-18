import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SectionCardProps {
  icon?: ReactNode
  title?: string
  className?: string
  iconColor?: string
  children: ReactNode
}

export function SectionCard({ icon, title, className, iconColor = "bg-muted", children }: SectionCardProps) {
  return (
    <div className={cn("bg-white rounded-lg p-6 mb-6 shadow-sm", className)}>
      {(icon || title) && (
        <div className="flex items-center gap-3 mb-6">
          {icon && (
            <div className={cn("p-2 rounded-full", iconColor)}>
              <div className="text-foreground">{icon}</div>
            </div>
          )}
          {title && <h3 className="font-medium text-lg">{title}</h3>}
        </div>
      )}
      <div>{children}</div>
    </div>
  )
}
