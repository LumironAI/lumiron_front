"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { SectionCard } from "@/components/agent-creation/common/section-card"
import { FormRow } from "@/components/agent-creation/common/form-row"
import { ActionButtons } from "@/components/agent-creation/common/action-buttons"
import { SectorGrid } from "@/components/agent-creation/step1-create/sector-grid"
import { useToast } from "@/hooks/ui/use-toast"
import { agentService } from "@/services/agent.service"

export default function CreateAgentPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [name, setName] = useState("")
  const [sector, setSector] = useState("restaurant")
  const [isLoading, setIsLoading] = useState(false)

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const handleSectorChange = (newSector: string) => {
    setSector(newSector)
  }

  const handleSaveAsDraft = async () => {
    try {
      setIsLoading(true)

      // Create a new agent with draft status
      const agent = await agentService.createAgent({
        name: name || "Nouvel agent",
        sector,
        status: "draft",
      })

      toast({
        title: "Brouillon enregistré",
        description: "Votre agent a été sauvegardé comme brouillon",
        variant: "success",
      })

      router.push("/agents")
    } catch (error) {
      console.error("Error saving draft:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleContinue = async () => {
    try {
      setIsLoading(true)

      // Validate required fields
      if (!name.trim()) {
        toast({
          title: "Champ requis",
          description: "Veuillez saisir un nom pour votre agent",
          variant: "destructive",
        })
        return
      }

      // Create a new agent with draft status
      const agent = await agentService.createAgent({
        name,
        sector,
        status: "draft",
      })

      if (agent && agent.id) {
        // Navigate to next step with the new agent ID
        router.push(`/agents/${agent.id}/informations`)
      } else {
        throw new Error("Failed to create agent")
      }
    } catch (error) {
      console.error("Error creating agent:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de l'agent",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-6">Création d'un agent</h1>
      </div>

      <div className="space-y-6">
        <SectionCard>
          <FormRow>
            <div>
              <label className="block text-sm font-medium mb-1">
                Nom de l'agent <span className="text-red-500">*</span>
              </label>
              <Input placeholder="Nom de l'agent" value={name} onChange={handleNameChange} className="w-full" />
            </div>
          </FormRow>
        </SectionCard>

        <SectionCard title="Secteur d'activité">
          <SectorGrid selectedSector={sector} onSectorChange={handleSectorChange} />
        </SectionCard>

        <ActionButtons
          onSaveAsDraft={handleSaveAsDraft}
          onContinue={handleContinue}
          disabled={isLoading}
          showPrevious={false}
        />
      </div>
    </div>
  )
}
