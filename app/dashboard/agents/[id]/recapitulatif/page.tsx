"use client"

import { useRouter, useParams } from "next/navigation"
import { useState, useEffect, use } from "react"
import { AgentCreationLayout } from "@/components/agent-creation/layout/agent-creation-layout"
import { ActionButtons } from "@/components/agent-creation/common/action-buttons"
import { InfoSummarySection } from "@/components/agent-creation/step4-recap/info-summary-section"
import { HoursSummarySection } from "@/components/agent-creation/step4-recap/hours-summary-section"
import { ClosureSummarySection } from "@/components/agent-creation/step4-recap/closure-summary-section"
import { OptionsSummarySection } from "@/components/agent-creation/step4-recap/options-summary-section"
import { VoiceSummarySection } from "@/components/agent-creation/step4-recap/voice-summary-section"
import { IntegrationsSummarySection } from "@/components/agent-creation/step4-recap/integrations-summary-section"
import { DocumentsSummarySection } from "@/components/agent-creation/step4-recap/documents-summary-section"
import { useAgentCreation } from "@/contexts/agent-creation-context"
import { useToast } from "@/hooks/ui/use-toast"
import { agentService } from "@/services/agent.service"

export default function AgentRecapPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const routeParams = useParams()
  const unwrappedParams = use(params)
  const agentId = unwrappedParams.id || (routeParams?.id as string)
  const { agentData, updateAgentData, resetAgentData, setAgentId } = useAgentCreation()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)

  // Load agent data if we have an ID
  useEffect(() => {
    async function loadAgentData() {
      try {
        if (agentId) {
          setIsInitializing(true)
          const { data, error } = await agentService.getAgentById(agentId)
          if (data) {
            // Update context with loaded data
            updateAgentData({
              id: agentId,
              name: data.name,
              status: data.status,
            })
            setAgentId(agentId)
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
  }, [agentId, updateAgentData, setAgentId, toast])

  const handlePrevious = () => {
    router.push(`/dashboard/agents/${agentId}/configuration`)
  }

  const handleSaveAsDraft = async () => {
    try {
      setIsLoading(true)
      await agentService.updateAgent(agentId, {
        name: agentData.name,
        status: "draft",
      })
      toast({
        title: "Brouillon enregistré",
        description: "Votre agent a été sauvegardé comme brouillon",
        variant: "success",
      })
      resetAgentData()
      router.push("/dashboard/agents")
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateAgent = async () => {
    try {
      setIsLoading(true)
      await agentService.updateAgent(agentId, {
        name: agentData.name,
        status: "active",
      })

      toast({
        title: "Agent créé avec succès",
        description: "Votre agent a été créé et est maintenant disponible",
        variant: "success",
      })
      resetAgentData()
      router.push("/dashboard/agents")
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de l'agent",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Convertir les dates de fermeture en périodes uniquement si l'option est activée
  const closurePeriods =
    agentData.closureDays?.enabled && agentData.closureDays?.dates?.length > 0
      ? [
          {
            start: "07/04/2025",
            end: "13/04/2025",
          },
          {
            start: "10/09/2025",
            end: "01/10/2025",
          },
          {
            start: "10/01/2026",
            end: "10/02/2026",
          },
        ]
      : []

  // Filtrer les intégrations activées
  const enabledIntegrations = agentData.integrations?.filter((integration) => integration.enabled) || []

  if (isInitializing) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <AgentCreationLayout agentId={agentId} activeTab="recapitulatif">
      <InfoSummarySection
        agentName={agentData.name}
        sector={agentData.sector}
        establishment={agentData.establishment}
        website={agentData.website}
        address={agentData.address}
        city={agentData.city}
        phoneNumber={agentData.phoneNumber}
        deviceType={agentData.deviceType}
        additionalInfo={agentData.additionalInfo}
      />

      <HoursSummarySection openingHours={agentData.openingHours} />

      <ClosureSummarySection closurePeriods={closurePeriods} />

      <OptionsSummarySection options={agentData.options} foodOptions={agentData.foodOptions} />

      <VoiceSummarySection
        gender={agentData.voiceGender ? (agentData.voiceGender as "homme" | "femme") : "homme"}
        voiceType={agentData.voiceType ? (agentData.voiceType as "enthousiaste" | "professionnelle") : "professionnelle"}
      />

      <IntegrationsSummarySection integrations={enabledIntegrations} />

      <DocumentsSummarySection
        documents={
          agentData.documents?.map((doc, index) => ({
            id: `doc-${index}`,
            name: doc,
          })) || []
        }
        onPreview={(docId) => {
          toast({
            title: "Aperçu du document",
            description: `Aperçu du document ${docId} (fonctionnalité simulée)`,
          })
        }}
      />

      <ActionButtons
        onPrevious={handlePrevious}
        onSaveAsDraft={handleSaveAsDraft}
        onContinue={handleCreateAgent}
        showValidate={true}
        disabled={isLoading}
      />
    </AgentCreationLayout>
  )
}
