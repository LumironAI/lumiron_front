"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useSubscription } from "@/hooks/use-subscription"
import { useRouter } from "next/navigation"
import { agentService } from "@/services/agent.service"
import { useToast } from "@/hooks/ui/use-toast"
// antoine test 2

export function CreateAgentButton() {
  const [canCreate, setCanCreate] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)
  const { canCreateAgent, planLimits } = useSubscription()
  const router = useRouter()
  const { toast } = useToast()

  const handleClick = async () => {
    try {
      // Check if user can create an agent based on subscription
      const canCreate = await canCreateAgent()
      if (!canCreate) {
        toast({
          title: "Limite atteinte",
          description: `Votre plan ${
            planLimits?.maxAgents === 0
              ? "ne permet pas de créer d'agents"
              : `permet ${planLimits?.maxAgents} agent(s) maximum`
          }.`,
          variant: "destructive",
        })
        return
      }

      setLoading(true)

      // Create a temporary agent in the database
      const initialData = {
        name: "Nouvel agent",
        status: "draft",
      }

      // Create a temporary agent and get its ID
      const agentId = await agentService.createTemporaryAgent(initialData)

      // Navigate to the first step of agent creation with the new ID
      router.push(`/dashboard/agents/${agentId}/create`)
    } catch (error) {
      console.error("Error creating agent:", error)
      toast({
        title: "Erreur",
        description: "Impossible de créer un nouvel agent. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleClick} disabled={loading} className="bg-[#2c90f6] hover:bg-[#2c90f6]/90 text-white">
      {loading ? (
        <span className="animate-pulse">Création...</span>
      ) : (
        <>
          <Plus className="mr-2 h-4 w-4" />
          Créer un agent
        </>
      )}
    </Button>
  )
}
