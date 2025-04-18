"use client"

import { useState, useEffect, use } from "react"
import { useRouter, useParams } from "next/navigation" 
import { Phone, Volume2, UserPlus, Settings, Database, Volume } from "lucide-react"
import { PhoneNumberSection } from "@/components/agent-creation/step3-configuration/phone-number-section"
import { VoiceSection } from "@/components/agent-creation/step3-configuration/voice-section"
import { TransferSection } from "@/components/agent-creation/step3-configuration/transfer-section"
import { OptionsSection } from "@/components/agent-creation/step3-configuration/options-section"
import { IntegrationsSection } from "@/components/agent-creation/step3-configuration/integrations-section"
import { AgentCreationLayout } from "@/components/agent-creation/layout/agent-creation-layout"
import { useAgentCreation, type VoiceProfile, type AgentData } from "@/contexts/agent-creation-context"
import { useToast } from "@/hooks/ui/use-toast"
import { agentService } from "@/services/agent.service"
import { ActionButtons } from "@/components/agent-creation/common/action-buttons"

export default function AgentConfigurationPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const routeParams = useParams() 
  const unwrappedParams = use(params)
  const agentId = unwrappedParams.id || (routeParams?.id as string)
  const { agentData, voiceProfiles, updateAgentData, setAgentId } = useAgentCreation()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  const [isAgentLoaded, setIsAgentLoaded] = useState(false)

  // États pour les différentes sections
  const [phoneNumber, setPhoneNumber] = useState(agentData.phoneNumber || "+33 6 12 34 56 78")
  const [deviceType, setDeviceType] = useState<"apple" | "autres">(
    (agentData.deviceType as "apple" | "autres") || "apple",
  )
  const [gender, setGender] = useState<"homme" | "femme">((agentData.voiceGender as "homme" | "femme") || "homme")
  const [voiceType, setVoiceType] = useState<"enthousiaste" | "professionnelle">(
    (agentData.voiceType as "enthousiaste" | "professionnelle") || "enthousiaste",
  )
  const [transferPhone, setTransferPhone] = useState(agentData.transferPhone || "")
  const [options, setOptions] = useState<{ id: string; label: string; description?: string; enabled: boolean }[]>(
    agentData.configOptions || [
      { id: "sms", label: "SMS", description: "Activer l'envoi de SMS (0.15 centimes / SMS)", enabled: false },
      { id: "autres", label: "Autres", enabled: false },
    ]
  )
  const [integrations, setIntegrations] = useState(
    agentData.integrations || [
      {
        id: "thefork",
        name: "TheFork",
        enabled: false,
        description: "Connecter votre compte",
        fields: [
          { id: "site_name", label: "Nom du site", value: "" },
          { id: "site_id", label: "ID du site", value: "" },
          { id: "account_id", label: "ID du compte", value: "" },
          { id: "restaurant_id", label: "ID restaurant", value: "" },
          { id: "api_key", label: "Clé API", value: "********" },
        ],
      },
      {
        id: "zenchef",
        name: "ZenChef",
        enabled: false,
        description: "Connecter votre compte",
        fields: [
          { id: "site_name", label: "Nom du site", value: "" },
          { id: "site_id", label: "ID du site", value: "" },
          { id: "account_id", label: "ID du compte", value: "" },
          { id: "restaurant_id", label: "ID restaurant", value: "" },
          { id: "api_key", label: "Clé API", value: "********" },
        ],
      },
      { id: "sevenrooms", name: "SevenRooms", enabled: false, description: "Connecter votre compte" },
      { id: "custom", name: "Système personnalisé", enabled: false, description: "Connecter votre compte" },
    ]
  )
  const [transferExamples, setTransferExamples] = useState([
    { id: "1", enabled: false, label: "Exemple 1" },
    { id: "2", enabled: false, label: "Exemple 2" },
    { id: "3", enabled: false, label: "Exemple 3" },
  ])

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

          if (error) {
            throw error
          }

          if (data) {
            // Map snake_case from DB to camelCase for context
            const updatedData = {
              id: data.id.toString(),
              name: data.name,
              status: data.status,
              phoneNumber: data.redirect_phone_number || phoneNumber, // Map redirect_phone_number to phoneNumber
              deviceType: data.devicetype || deviceType,             // Map devicetype to deviceType
              voiceGender: data.voiceGender || gender,
              voiceType: data.voiceType || voiceType,
              voice_profile_id: data.voice_profile_id,
              transferPhone: data.transfer_phone || transferPhone,    // Map transfer_phone to transferPhone
              configOptions: data.config_options || options,       // Map config_options to configOptions
              integrations: data.integrations || integrations,
              // Include necessary fields from previous steps read from DB
              sector: data.sector,
              establishment: data.establishment,
              website: data.website,
              address: data.address,
              city: data.city,
              openingHours: data.openingHours,
              closureDays: {
                enabled: data.closureDays?.enabled || false,
                dates: (data.closureDays?.dates || []).map((d: string | Date) => typeof d === 'string' ? new Date(d) : d),
              },
              options: data.options, // General options
              foodOptions: data.foodOptions,
              additionalinfo: data.additionalinfo, // Map additionalinfo
              documents: data.document_urls || [], // Map document_urls
            }

            // Mettre à jour le contexte avec TOUTES les données mappées
            updateAgentData(updatedData)
            setAgentId(agentId)

            // Mettre à jour les états locaux (utilisent camelCase ou noms locaux)
            if (updatedData.phoneNumber) setPhoneNumber(updatedData.phoneNumber)
            if (updatedData.deviceType) setDeviceType(updatedData.deviceType as "apple" | "autres")
            if (updatedData.voiceGender) setGender(updatedData.voiceGender as "homme" | "femme")
            if (updatedData.voiceType) setVoiceType(updatedData.voiceType as "enthousiaste" | "professionnelle")
            if (updatedData.transferPhone) setTransferPhone(updatedData.transferPhone)
            if (updatedData.configOptions) setOptions(updatedData.configOptions)
            if (updatedData.integrations) setIntegrations(updatedData.integrations)
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
  }, [agentId, updateAgentData, setAgentId, toast, isAgentLoaded])

  // **Nouveau useEffect pour déterminer voice_profile_id**
  useEffect(() => {
    if (voiceProfiles.length > 0 && gender && voiceType) {
      let targetDisplayName = ""
      if (gender === "femme") {
        targetDisplayName = voiceType === "enthousiaste" ? "Stephanie - Enthousiaste" : "Sandrine - Professionnelle"
      } else { // homme
        targetDisplayName = voiceType === "enthousiaste" ? "Antoine - Enthousiaste" : "Jean - Professionnelle" // Assurez-vous que ce nom correspond exactement à celui dans la DB
      }

      const foundProfile = voiceProfiles.find((p) => p.display_name === targetDisplayName)

      if (foundProfile && agentData.voice_profile_id !== foundProfile.id) {
        // Mettre à jour le contexte SEULEMENT si l'ID a changé
        updateAgentData({ voice_profile_id: foundProfile.id })
      } else if (!foundProfile) {
        console.warn(`Voice profile not found for display name: ${targetDisplayName}`)
        // Optionnel: réinitialiser l'ID si aucun profil ne correspond ?
        // updateAgentData({ voice_profile_id: undefined })
      }
    }
  }, [gender, voiceType, voiceProfiles, updateAgentData, agentData.voice_profile_id]) // Dépendances: selections utilisateur et liste chargée

  // Gestionnaires d'événements
  const handlePrevious = async () => {
    try {
      setIsLoading(true)
      await saveData()
      router.push(`/dashboard/agents/${agentId}/informations`)
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

  const handleSaveAsDraft = async () => {
    try {
      setIsLoading(true)
      await saveData(true)
      toast({
        title: "Brouillon enregistré",
        description: "Votre agent a été sauvegardé comme brouillon",
        variant: "success",
      })
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

  const handleContinue = async () => {
    try {
      setIsLoading(true)
      await saveData()
      toast({
        title: "Configuration enregistrée",
        description: "Passons à l'étape suivante",
        variant: "success",
      })
      router.push(`/dashboard/agents/${agentId}/recapitulatif`)
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

  const saveData = async (asDraft = false) => {
    // Préparer les données avec les NOMS DE COLONNES BDD
    const dataToSend: Record<string, any> = {
      name: agentData.name,
      status: asDraft ? "draft" : agentData.status || "draft",
      redirect_phone_number: phoneNumber,
      devicetype: deviceType,
      voice_profile_id: agentData.voice_profile_id,
      transfer_phone: transferPhone,
      config_options: options,
      integrations: integrations,
      sector: agentData.sector,
      establishment: agentData.establishment,
      website: agentData.website,
      address: agentData.address,
      city: agentData.city,
      openingHours: agentData.openingHours,
      closureDays: agentData.closureDays,
      options: agentData.options,           // This is the options object for establishment features (PMR, Terrasse etc)
      foodOptions: agentData.foodOptions,
      additionalinfo: agentData.additionalInfo, // Use DB column name (lowercase i)
      document_urls: agentData.documents, // <- Nom BDD
    };

    // Mettre à jour le contexte (utilise les noms de contexte)
    updateAgentData({
      // Ici on peut garder les noms de contexte pour la mise à jour locale
      phoneNumber: phoneNumber, // Met à jour le 'phoneNumber' du contexte
      deviceType: deviceType, // <- GARDER camelCase ici pour le contexte
      voice_profile_id: agentData.voice_profile_id,
      transferPhone: transferPhone,
      configOptions: options,
      integrations: integrations,
      // Les autres champs sont déjà dans agentData
      status: asDraft ? "draft" : agentData.status || "draft",
    });

    // Envoi au backend (utilise l'objet avec les noms BDD)
    try {
      await agentService.updateAgent(agentId, dataToSend);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      throw error;
    }
  };

  // Event handlers pour les composants
  const handlePhoneNumberChange = (value: string) => {
    setPhoneNumber(value)
  }

  const handleDeviceTypeChange = (value: "apple" | "autres") => {
    setDeviceType(value)
  }

  const handleGenderChange = (value: "homme" | "femme") => {
    setGender(value)
  }

  const handleVoiceTypeChange = (value: "enthousiaste" | "professionnelle") => {
    setVoiceType(value)
  }

  const handleTransferPhoneChange = (value: string) => {
    setTransferPhone(value)
  }

  const handleOptionsChange = (updatedOptions: typeof options) => {
    setOptions(updatedOptions)
  }

  const handleIntegrationsChange = (updatedIntegrations: typeof integrations) => {
    setIntegrations(updatedIntegrations)
  }

  if (isInitializing) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <AgentCreationLayout agentId={agentId} activeTab="configuration">
      {/* Numéro de téléphone */}
      <PhoneNumberSection 
        initialPhoneNumber={phoneNumber}
        initialDeviceType={deviceType}
        onPhoneNumberChange={handlePhoneNumberChange}
        onDeviceTypeChange={handleDeviceTypeChange}
      />

      {/* Voix de l'agent */}
      <VoiceSection
        initialGender={gender}
        initialVoiceType={voiceType}
        onGenderChange={handleGenderChange}
        onVoiceTypeChange={handleVoiceTypeChange}
      />

      {/* Transfert d'appel */}
      <TransferSection
        initialPhoneNumber={transferPhone}
        initialExamples={transferExamples}
        onPhoneNumberChange={handleTransferPhoneChange}
      />

      {/* Options */}
      <OptionsSection
        initialOptions={options}
        onOptionsChange={handleOptionsChange}
      />

      {/* Intégrations */}
      <IntegrationsSection
        initialIntegrations={integrations}
        onIntegrationsChange={handleIntegrationsChange}
      />

      {/* Boutons d'action */}
      <ActionButtons
        onPrevious={handlePrevious}
        onSaveAsDraft={handleSaveAsDraft}
        onContinue={handleContinue}
        disabled={isLoading}
      />
    </AgentCreationLayout>
  )
}
