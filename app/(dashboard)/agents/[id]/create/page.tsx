"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { SectionCard } from "@/components/agent-creation/common/section-card"
import { FormRow } from "@/components/agent-creation/common/form-row"
import { ActionButtons } from "@/components/agent-creation/common/action-buttons"
import { AgentCreationLayout } from "@/components/agent-creation/layout/agent-creation-layout"
import { SectorGrid } from "@/components/agent-creation/step1-create/sector-grid"
import { useAgentCreation } from "@/contexts/agent-creation-context"
import { useToast } from "@/hooks/ui/use-toast"
import { agentService } from "@/services/agent.service"

export default function AgentCreatePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { agentData, updateAgentData, setAgentId } = useAgentCreation()
  const { toast } = useToast()

  const [name, setName] = useState(agentData.name || "")
  const [sector, setSector] = useState(agentData.sector || "restaurant")
  const [isLoading, setIsLoading] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)

  // Load agent data if we have an ID
  useEffect(() => {
    async function loadAgentData() {
      try {
        if (params.id) {
          setIsInitializing(true)
          const { data, error } = await agentService.getAgentById(params.id)

          if (error) {
            throw error
          }

          if (data) {
            // Update context with loaded data
            const agentData = {
              id: data.id.toString(),
              name: data.name,
              status: data.status,
              sector: "restaurant", // Default sector since we don't store it in the database
            }

            updateAgentData(agentData)
            setAgentId(params.id)

            // Update local state
            setName(data.name || "")
          }
        }
      } catch (error) {
        console.error("Error loading agent data:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les données de l'agent",
          variant: "destructive",
        })
      } finally {
        setIsInitializing(false)
      }
    }

    loadAgentData()
  }, [params.id, updateAgentData, setAgentId, toast])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setName(newName)
  }

  const handleSectorChange = (newSector: string) => {
    setSector(newSector)
  }

  const handleSaveAsDraft = async () => {
    try {
      setIsLoading(true)

      // Update context data
      updateAgentData({ name, sector })

      // Save to database
      await agentService.updateAgent(params.id, {
        name,
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

      // Update context data
      updateAgentData({ name, sector })

      // Save to database
      await agentService.updateAgent(params.id, {
        name,
        status: "draft",
      })

      // Navigate to next step
      router.push(`/agents/${params.id}/informations`)
    } catch (error) {
      console.error("Error saving agent:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isInitializing) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <AgentCreationLayout agentId={params.id} activeTab="create">
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
    </AgentCreationLayout>
  )
}
