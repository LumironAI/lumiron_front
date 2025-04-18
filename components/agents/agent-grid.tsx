import type { ReactNode } from "react"

interface AgentGridProps {
  children: ReactNode
  className?: string
}

export function AgentGrid({ children, className = "" }: AgentGridProps) {
  return <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>{children}</div>
}
