"use client"

import { useRouter, useParams } from "next/navigation"
import { useState, useEffect, use } from "react"
import { format, differenceInDays, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AgentCreationLayout } from "@/components/agent-creation/layout/agent-creation-layout"
import { ActionButtons } from "@/components/agent-creation/common/action-buttons"
import { InfoSummarySection } from "@/components/agent-creation/step4-recap/info-summary-section"
import { HoursSummarySection } from "@/components/agent-creation/step4-recap/hours-summary-section"
import { ClosureSummarySection } from "@/components/agent-creation/step4-recap/closure-summary-section"
import { OptionsSummarySection } from "@/components/agent-creation/step4-recap/options-summary-section"
import { VoiceSummarySection } from "@/components/agent-creation/step4-recap/voice-summary-section"
import { IntegrationsSummarySection } from "@/components/agent-creation/step4-recap/integrations-summary-section"
import { DocumentsSummarySection } from "@/components/agent-creation/step4-recap/documents-summary-section"
import { ConfigSummarySection } from "@/components/agent-creation/step4-recap/config-summary-section"
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
  const [isAgentLoaded, setIsAgentLoaded] = useState(false)

  // Load agent data if we have an ID
  useEffect(() => {
    // Éviter de charger l'agent plus d'une fois
    if (isAgentLoaded) {
      return;
    }
    
    async function loadAgentData() {
      try {
        if (agentId) {
          setIsInitializing(true)
          setIsAgentLoaded(true)
          const { data, error } = await agentService.getAgentById(agentId)
          if (data) {
            // Update context with loaded data without losing existing data
            // Map snake_case from DB to camelCase for context
            updateAgentData({
              id: agentId,
              name: data.name,
              status: data.status,
              sector: data.sector || agentData.sector,
              establishment: data.establishment || agentData.establishment,
              website: data.website || agentData.website,
              address: data.address || agentData.address,
              city: data.city || agentData.city,
              phoneNumber: data.redirect_phone_number || agentData.phoneNumber,
              deviceType: data.devicetype || agentData.deviceType,
              voiceGender: data.voiceGender || agentData.voiceGender,
              voiceType: data.voiceType || agentData.voiceType,
              voice_profile_id: data.voice_profile_id || agentData.voice_profile_id,
              transferPhone: data.transfer_phone || agentData.transferPhone,
              configOptions: data.config_options || agentData.configOptions,
              openingHours: data.openingHours || agentData.openingHours,
              options: data.options || agentData.options,
              foodOptions: data.foodOptions || agentData.foodOptions,
              closureDays: {
                enabled: data.closureDays?.enabled || agentData.closureDays?.enabled || false,
                dates: (data.closureDays?.dates || agentData.closureDays?.dates || []).map((d: string | Date) => typeof d === 'string' ? new Date(d) : d),
              },
              additionalInfo: data.additionalinfo || agentData.additionalInfo,
              documents: data.document_urls || agentData.documents,
              integrations: data.integrations || agentData.integrations,
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
  }, [agentId, isAgentLoaded, updateAgentData, setAgentId, toast])

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
      // Préparer l'objet final avec les NOMS DE COLONNES BDD
      const finalAgentDataDB: Record<string, any> = {
        ...agentData, // Commencer avec les données du contexte
        status: "active", // Définir le statut final
        redirect_phone_number: agentData.phoneNumber,
        document_urls: agentData.documents,
        // Ajouter les autres remappages de casse
        additionalinfo: agentData.additionalInfo,
        devicetype: agentData.deviceType,
        voice_profile_id: agentData.voice_profile_id,
        transfer_phone: agentData.transferPhone,
        config_options: agentData.configOptions,
        openingHours: agentData.openingHours,
        options: agentData.options,
      };
      // Supprimer les clés qui n'existent pas dans la BDD ou qui viennent du contexte
      delete finalAgentDataDB.phoneNumber;
      delete finalAgentDataDB.documents;
      delete finalAgentDataDB.additionalInfo; // Supprimer ancienne clé
      delete finalAgentDataDB.deviceType; // Supprimer ancienne clé
      delete finalAgentDataDB.voiceGender; // Explicitly remove context key
      delete finalAgentDataDB.voiceType;  // Explicitly remove context key
      delete finalAgentDataDB.transferPhone;
      delete finalAgentDataDB.configOptions;
      // Supprimer d'autres clés potentiellement non mappées si elles existent dans AgentData
      // delete finalAgentDataDB.someContextOnlyKey;

      await agentService.updateAgent(agentId, finalAgentDataDB)

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

  // **Correction: Convertir les dates de fermeture réelles en périodes**
  const calculateClosurePeriods = () => {
    if (!agentData.closureDays?.enabled || !agentData.closureDays.dates || agentData.closureDays.dates.length === 0) {
      return [];
    }

    const dates = agentData.closureDays.dates
      .map(d => new Date(d)) // S'assurer que ce sont des objets Date
      .sort((a, b) => a.getTime() - b.getTime()); // Trier les dates

    if (dates.length === 0) return [];

    const periods = [];
    let periodStart = dates[0];
    let periodEnd = dates[0];

    for (let i = 1; i < dates.length; i++) {
      // Vérifier si la date actuelle est le jour suivant la date de fin de période en cours
      if (differenceInDays(dates[i], periodEnd) === 1) {
        // Si oui, étendre la période
        periodEnd = dates[i];
      } else {
        // Si non, finaliser la période précédente et commencer une nouvelle
        periods.push({
          start: format(periodStart, 'dd/MM/yyyy', { locale: fr }),
          end: format(periodEnd, 'dd/MM/yyyy', { locale: fr }),
        });
        periodStart = dates[i];
        periodEnd = dates[i];
      }
    }

    // Ajouter la dernière période
    periods.push({
      start: format(periodStart, 'dd/MM/yyyy', { locale: fr }),
      end: format(periodEnd, 'dd/MM/yyyy', { locale: fr }),
    });

    return periods;
  };

  const closurePeriods = calculateClosurePeriods();

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
        agentName={agentData.name || ""}
        sector={agentData.sector || ""}
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

      <ConfigSummarySection
        transferPhone={agentData.transferPhone}
        configOptions={agentData.configOptions}
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
