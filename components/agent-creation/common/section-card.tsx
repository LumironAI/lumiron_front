import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SectionCardProps {
  icon?: ReactNode
  title?: string
  className?: string
  iconColor?: string
  children: ReactNode
}

export function SectionCard({ icon, title, className, iconColor = "bg-gray-100", children }: SectionCardProps) {
  return (
    <div className={cn("bg-white rounded-lg p-5 mb-5 shadow-sm border border-gray-100", className)}>
      {(icon || title) && (
        <div className="flex items-center gap-3 mb-5">
          {icon && (
            <div className={cn("p-2 rounded-md", iconColor)}>
              <div className="text-gray-600">{icon}</div>
            </div>
          )}
          {title && <h3 className="font-medium text-base">{title}</h3>}
        </div>
      )}
      <div>{children}</div>
    </div>
  )
}
