"use client"

import { Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { agentService } from "@/services/agent.service"
import { useToast } from "@/hooks/ui/use-toast"

export function EmptyState() {
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleCreateAgent = async () => {
    try {
      setIsCreating(true)

      // Create a temporary agent
      const initialData = {
        name: "Nouvel agent",
        status: "draft",
      }

      // Create a temporary agent and get its ID
      const agentId = await agentService.createTemporaryAgent(initialData)

      // Navigate to the first step of agent creation with the real ID
      router.push(`/agents/${agentId}/create`)
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
    <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
      <h2 className="text-2xl font-medium text-gray-800 mb-6">
        Commencez par créer votre agent d&apos;appels entrants
      </h2>
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
            <Plus className="w-4 h-4 mr-2" />
            Créer un agent
          </>
        )}
      </Button>
    </div>
  )
}
