import type { ReactNode } from "react"
import { AgentCreationProvider } from "@/contexts/agent-creation-context"

export default function AgentsLayout({
  children,
}: {
  children: ReactNode
}) {
  console.log("Agents layout rendering")

  // Wrap children with AgentCreationProvider to make it available to all agent pages
  return <AgentCreationProvider>{children}</AgentCreationProvider>
}
