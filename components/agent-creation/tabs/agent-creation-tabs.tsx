import Link from "next/link"
import { cn } from "@/lib/utils"

interface AgentCreationTabsProps {
  agentId: string
  activeTab: "create" | "informations" | "configuration" | "recapitulatif"
}

export function AgentCreationTabs({ agentId, activeTab }: AgentCreationTabsProps) {
  const tabs = [
    {
      id: "create",
      label: "Création",
      href: `/dashboard/agents/${agentId}/create`,
    },
    {
      id: "informations",
      label: "Informations",
      href: `/dashboard/agents/${agentId}/informations`,
    },
    {
      id: "configuration",
      label: "Configuration",
      href: `/dashboard/agents/${agentId}/configuration`,
    },
    {
      id: "recapitulatif",
      label: "Récapitulatif",
      href: `/dashboard/agents/${agentId}/recapitulatif`,
    },
  ]

  return (
    <div className="border-b">
      <nav className="flex -mb-px space-x-8">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={tab.href}
            className={cn(
              "py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap",
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
            )}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
