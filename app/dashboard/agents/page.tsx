"use client"

import { useState } from "react"
import { PageHeader } from "@/components/header/page-header"
import { SearchBar } from "@/components/header/search-bar"
import { UserNav } from "@/components/header/user-nav"
import { Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AgentGrid } from "@/components/agents/agent-grid"
import { AgentCard } from "@/components/agents/agent-card"
import { EmptyState } from "@/components/agents/empty-state"
import { useAgents } from "@/hooks/use-agents"
import { useRouter } from "next/navigation"
import { agentService } from "@/services"
import { useToast } from "@/hooks/ui/use-toast"

export default function AgentsPage() {
  const { agents, isLoading, error } = useAgents()
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Filter agents based on search term
  const filteredAgents = agents?.filter((agent) => agent.name.toLowerCase().includes(searchTerm.toLowerCase())) || []

  const hasAgents = filteredAgents.length > 0

  const handleCreateAgent = async () => {
    try {
      setIsCreating(true)

      // Create a temporary agent in the database first
      const initialData = {
        name: "Nouvel agent",
        status: "draft" as "active" | "inactive" | "draft",
      }

      // Create a temporary agent and get its ID
      const agent = await agentService.createAgent(initialData)

      if (agent) {
        // Navigate to the first step of agent creation with the real ID
        router.push(`/dashboard/agents/${agent.id}/create`)
      } else {
        throw new Error("Failed to create agent")
      }
    } catch (error) {
      console.error("Error creating agent:", error)
      toast({
        title: "Erreur",
        description: "Impossible de créer un nouvel agent",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <PageHeader title="Agents" />
        <div className="flex items-center gap-4">
          <UserNav />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">
          Une erreur est survenue lors du chargement des agents. Veuillez réessayer.
        </div>
      ) : hasAgents ? (
        <>
          <div className="flex items-center justify-between mb-8">
            <SearchBar
              placeholder="Rechercher un agent..."
              onChange={(value) => setSearchTerm(value)}
              value={searchTerm}
            />
            <Button
              onClick={handleCreateAgent}
              disabled={isCreating}
              className="bg-[#2c90f6] hover:bg-[#2c90f6]/90 text-white"
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Créer un agent
                </>
              )}
            </Button>
          </div>

          <AgentGrid>
            {filteredAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </AgentGrid>
        </>
      ) : (
        <EmptyState />
      )}
    </div>
  )
}
