import type { ReactNode } from "react"
import { AgentCreationTabs } from "@/components/agent-creation/tabs/agent-creation-tabs"

interface AgentCreationLayoutProps {
  children: ReactNode
  agentId: string
  activeTab: "create" | "informations" | "configuration" | "recapitulatif"
}

export function AgentCreationLayout({ children, agentId, activeTab }: AgentCreationLayoutProps) {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-6">Création d'un agent</h1>
        {/* Make sure the tabs are correctly linked */}
        <AgentCreationTabs agentId={agentId} activeTab={activeTab} />
      </div>
      <div className="space-y-6">{children}</div>
    </div>
  )
}
