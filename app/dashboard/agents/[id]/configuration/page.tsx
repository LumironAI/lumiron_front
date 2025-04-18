"use client"

import { useState, useEffect, use } from "react"
import { useRouter, useParams } from "next/navigation" 
import { Phone, Volume2, UserPlus, Settings, Database, VolumeX, VolumeUp, VolumeUp2, ArrowUp, ArrowDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AgentCreationLayout } from "@/components/agent-creation/layout/agent-creation-layout"
import { useAgentCreation } from "@/contexts/agent-creation-context"
import { useToast } from "@/hooks/ui/use-toast"
import { agentService } from "@/services/agent.service"
import { ActionButtons } from "@/components/agent-creation/common/action-buttons"
import { SectionCard } from "@/components/agent-creation/common/section-card"
import { FormRow } from "@/components/agent-creation/common/form-row"

export default function AgentConfigurationPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const routeParams = useParams() 
  const unwrappedParams = use(params)
  const agentId = unwrappedParams.id || (routeParams?.id as string)
  const { agentData, updateAgentData, setAgentId } = useAgentCreation()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)

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
  const [voiceExamples, setVoiceExamples] = useState<string[]>(agentData.voiceExamples || [])
  const [options, setOptions] = useState<{ id: string; label: string; description?: string; enabled: boolean }[]>([
    { id: "sms", label: "SMS", description: "Activer l'envoi de SMS (0.15 centimes / SMS)", enabled: false },
    { id: "autres", label: "Autres", enabled: false },
  ])
  const [integrations, setIntegrations] = useState([
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
  ])

  // Load agent data if we have an ID
  useEffect(() => {
    async function loadAgentData() {
      try {
        if (agentId) {
          setIsInitializing(true)
          const { data, error } = await agentService.getAgentById(agentId)

          if (error) {
            throw error
          }

          if (data) {
            // Update context with loaded data
            const agentData = {
              id: data.id.toString(),
              name: data.name,
              status: data.status,
              voiceGender: data.voiceGender || "homme",
              voiceType: data.voiceType || "professionnelle",
            }

            updateAgentData(agentData)
            setAgentId(agentId)

            // Update local state
            setGender(data.voiceGender || "homme")
            setVoiceType(data.voiceType || "professionnelle")
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

  // Gestionnaires d'événements
  const handlePrevious = async () => {
    try {
      setIsLoading(true)
      await saveData()
      router.push(`/agents/${agentId}/informations`)
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
      router.push("/agents")
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
      router.push(`/agents/${agentId}/recapitulatif`)
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
    // Mise à jour du contexte local
    const updatedData = {
      phoneNumber,
      deviceType,
      voiceGender,
      voiceType,
      transferPhone,
      configOptions: options,
      integrations: integrations.filter((i) => i.enabled),
    }

    updateAgentData(updatedData)

    // Envoi au backend - only update the name and status in the database
    try {
      if (asDraft) {
        await agentService.saveAgentDraft({
          id: agentId,
          name: agentData.name,
          status: "draft",
        })
      } else {
        // Mise à jour d'un agent existant - only basic fields
        await agentService.updateAgent(agentId, {
          name: agentData.name,
          status: "draft",
        })
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
      throw error
    }
  }

  const toggleIntegration = (id: string) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === id ? { ...integration, enabled: !integration.enabled } : integration,
      ),
    )
  }

  const updateIntegrationField = (integrationId: string, fieldId: string, value: string) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === integrationId && integration.fields
          ? {
              ...integration,
              fields: integration.fields.map((field) => (field.id === fieldId ? { ...field, value } : field)),
            }
          : integration,
      ),
    )
  }

  const toggleExample = (id: string) => {
    const updatedExamples = voiceExamples.includes(id)
      ? voiceExamples.filter((exId) => exId !== id)
      : [...voiceExamples, id]
    setVoiceExamples(updatedExamples)
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
      {/* Section Numéro de téléphone */}
      <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-full bg-green-100">
            <Phone className="h-5 w-5 text-foreground" />
          </div>
          <h3 className="font-medium text-lg">Votre numéro de téléphone :</h3>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="bg-gray-50 p-3 rounded-md border border-gray-200 text-sm">{phoneNumber}</div>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Pour transférer votre numéro, veuillez remplir les informations ci-dessous en fonction de votre type
          d'appareil
        </p>

        <div className="flex gap-8 mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={deviceType === "apple"}
              onChange={() => setDeviceType("apple")}
              className="form-radio h-4 w-4 text-primary"
            />
            <span>Apple</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={deviceType === "autres"}
              onChange={() => setDeviceType("autres")}
              className="form-radio h-4 w-4 text-primary"
            />
            <span>Autres</span>
          </label>
        </div>

        {deviceType === "autres" && (
          <div className="bg-gray-100 p-4 rounded-md">
            <h4 className="font-medium mb-2">Comment transférer votre numéro :</h4>
            <ol className="list-decimal pl-5 space-y-2 text-sm">
              <li>Ouvrez l'application Téléphone sur votre appareil</li>
              <li>Accédez au clavier de numérotation</li>
              <li>Composez la commande suivante :</li>
              <div className="bg-white p-2 rounded my-1 text-center">
                <code>*21*{phoneNumber}</code>
              </div>
              <li>Appuyez sur le bouton d'appel</li>
            </ol>
          </div>
        )}
      </div>

      {/* Section Voix de l'agent */}
      <SectionCard
        icon={<VolumeUp className="h-5 w-5" />}
        title="Voix de l'agent"
        iconColor="bg-icon-voice"
      >
        <FormRow label="Genre">
          <Select value={gender} onValueChange={(value: "homme" | "femme") => setGender(value)}>
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder="Sélectionnez un genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="homme">Homme</SelectItem>
              <SelectItem value="femme">Femme</SelectItem>
            </SelectContent>
          </Select>
        </FormRow>

        <FormRow label="Type de voix">
          <Select
            value={voiceType}
            onValueChange={(value: "enthousiaste" | "professionnelle") => setVoiceType(value)}
          >
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder="Sélectionnez un type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professionnelle">Professionnelle</SelectItem>
              <SelectItem value="enthousiaste">Enthousiaste</SelectItem>
            </SelectContent>
          </Select>
        </FormRow>

        <FormRow label="Exemples de voix">
          <div className="space-y-2 w-full">
            {voiceExamples.map((example) => (
              <div
                key={example}
                className="flex items-center justify-between p-3 border rounded-md hover:bg-accent cursor-pointer"
                onClick={() => toggleExample(example)}
              >
                <div className="flex items-center space-x-3">
                  <VolumeUp2 className="h-5 w-5 text-primary" />
                  <span>{example}</span>
                </div>
                <Switch checked={voiceExamples.includes(example)} />
              </div>
            ))}
          </div>
        </FormRow>
      </SectionCard>

      {/* Section Transfert d'appel */}
      <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-full bg-orange-100">
            <UserPlus className="h-5 w-5 text-foreground" />
          </div>
          <h3 className="font-medium text-lg">Transfert d'appel à un humain</h3>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Rentrer votre numéro de téléphone :</label>
          <div className="flex items-center">
            <div className="relative flex-shrink-0">
              <button className="flex items-center justify-between h-10 px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none">
                <span>FR +33</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-1 h-4 w-4 opacity-50"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </div>
            <Input
              value={transferPhone}
              onChange={(e) => setTransferPhone(e.target.value)}
              placeholder="6 12 34 56 78"
              className="flex-1 ml-2"
            />
          </div>
        </div>
      </div>

      {/* Section Options */}
      <SectionCard
        icon={<Settings className="h-5 w-5" />}
        title="Options"
        iconColor="bg-icon-settings"
      >
        <div className="space-y-4">
          {options.map((option) => (
            <div key={option.id} className="flex items-center justify-between">
              <div>
                <div className="font-medium">{option.label}</div>
                {option.description && <div className="text-sm text-gray-500">{option.description}</div>}
              </div>
              <Switch
                checked={option.enabled}
                onCheckedChange={(checked) => {
                  setOptions((prev) => prev.map((opt) => (opt.id === option.id ? { ...opt, enabled: checked } : opt)))
                }}
              />
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Section Intégrations */}
      <SectionCard
        icon={<Database className="h-5 w-5" />}
        title="Intégrations"
        iconColor="bg-icon-database"
      >
        <div className="space-y-6">
          {integrations.map((integration) => (
            <div key={integration.id} className="border-b pb-4 last:border-0 last:pb-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                    {integration.id === "thefork" && <span className="text-xs font-bold">T</span>}
                    {integration.id === "zenchef" && <span className="text-xs font-bold">Z</span>}
                    {integration.id === "sevenrooms" && <span className="text-xs font-bold">S</span>}
                    {integration.id === "custom" && <span className="text-xs font-bold">C</span>}
                  </div>
                  <div>
                    <div className="font-medium">{integration.name}</div>
                    <div className="text-xs text-gray-500">{integration.description}</div>
                  </div>
                </div>
                <Switch checked={integration.enabled} onCheckedChange={() => toggleIntegration(integration.id)} />
              </div>

              {integration.enabled && integration.fields && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pl-8">
                  {integration.fields.map((field) => (
                    <div key={field.id}>
                      <label className="block text-xs font-medium mb-1">{field.label}</label>
                      <Input
                        value={field.value}
                        onChange={(e) => updateIntegrationField(integration.id, field.id, e.target.value)}
                        className="text-sm"
                        type={field.id === "api_key" ? "password" : "text"}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </SectionCard>

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
