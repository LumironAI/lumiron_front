"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { SectionCard } from "@/components/agent-creation/common/section-card"
import { FormRow } from "@/components/agent-creation/common/form-row"
import { ActionButtons } from "@/components/agent-creation/common/action-buttons"
import { AgentCreationLayout } from "@/components/agent-creation/layout/agent-creation-layout"
import { useAgentCreation } from "@/contexts/agent-creation-context"
import { useToast } from "@/hooks/ui/use-toast"
import { agentService } from "@/services/agent.service"
import { SectorGrid } from "@/components/agent-creation/step1-create/sector-grid"

export default function AgentCreatePage() {
  const router = useRouter()
  const params = useParams()
  const agentId = params?.id as string
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const { agentData, updateAgentData, setAgentId } = useAgentCreation()
  const [agentName, setAgentName] = useState(agentData.name || "")
  const [agentSector, setAgentSector] = useState(agentData.sector || "restaurant")
  const [isAgentLoaded, setIsAgentLoaded] = useState(false)

  useEffect(() => {
    // Éviter de charger l'agent plus d'une fois
    if (isAgentLoaded) {
      return;
    }

    async function loadAgent() {
      // Si on a un ID, on charge l'agent
      if (agentId) {
        try {
          setIsAgentLoaded(true);
          const { data, error } = await agentService.getAgentById(agentId)
          if (error) {
            toast({
              title: "Erreur",
              description: "Impossible de charger l'agent",
              variant: "destructive",
            })
            return
          }

          if (data) {
            // Si on a des données, on les charge
            setAgentName(data.name || "")
            setAgentSector(data.sector || "restaurant")
            // On met à jour le contexte
            updateAgentData({
              name: data.name || "",
              sector: data.sector || "restaurant",
            })
            setAgentId(agentId)
          }
        } catch (error) {
          console.error("Erreur lors du chargement de l'agent:", error)
          toast({
            title: "Erreur",
            description: "Impossible de charger l'agent",
            variant: "destructive",
          })
        }
      }
    }

    loadAgent()
  }, [agentId, isAgentLoaded, updateAgentData, setAgentId, toast])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgentName(e.target.value)
  }

  const handleSectorChange = (sectorId: string) => {
    setAgentSector(sectorId)
  }

  const handleSaveAsDraft = async () => {
    try {
      setIsLoading(true)
      const updatedAgentData = {
        ...agentData,
        name: agentName,
        sector: agentSector,
      }
      
      updateAgentData(updatedAgentData)
      
      if (agentId) {
        await agentService.updateAgent(agentId, {
          name: agentName,
          sector: agentSector,
          status: "draft",
        })
      }
      
      toast({
        title: "Brouillon enregistré",
        description: "Votre agent a été sauvegardé comme brouillon",
        variant: "success",
      })
      
      router.push("/dashboard/agents")
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les informations",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleContinue = async () => {
    if (!agentName.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un nom pour l'agent",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    
    try {
      const updatedAgentData = {
        ...agentData,
        name: agentName,
        sector: agentSector,
      }
      
      updateAgentData(updatedAgentData)
      
      // Si on a un ID, on met à jour l'agent
      if (agentId) {
        await agentService.updateAgent(agentId, {
          name: agentName,
          sector: agentSector,
          status: "draft",
        })
      }
      
      toast({
        title: "Succès",
        description: "Les informations ont été enregistrées",
        variant: "success",
      })
      
      router.push(`/dashboard/agents/${agentId}/informations`)
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les informations",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AgentCreationLayout agentId={agentId} activeTab="create">
      <SectionCard title="Informations de base">
        <FormRow>
          <div>
            <label className="block text-sm font-medium mb-1">
              Nom de l'agent <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Nom de l'agent"
              value={agentName}
              onChange={handleNameChange}
            />
          </div>
        </FormRow>
      </SectionCard>
      
      <SectionCard title="Secteur d'activité">
        <SectorGrid 
          selectedSector={agentSector} 
          onSectorChange={handleSectorChange} 
        />
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
