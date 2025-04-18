import type { ReactNode } from "react"

export default function AgentLayout({
  children,
  params,
}: {
  children: ReactNode
  params: { id: string }
}) {
  return <>{children}</>
}
