"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Phone, Volume2, UserPlus, Settings, Database } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { AgentCreationLayout } from "@/components/agent-creation/layout/agent-creation-layout"
import { useAgentCreation } from "@/contexts/agent-creation-context"
import { useToast } from "@/hooks/ui/use-toast"
import { agentService } from "@/services/agent.service"
import { ActionButtons } from "@/components/agent-creation/common/action-buttons"

export default function AgentConfigurationPage({ params }: { params: { id: string } }) {
  const router = useRouter()
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
  const [examples, setExamples] = useState([
    { id: "1", enabled: false, label: "Exemple 1" },
    { id: "2", enabled: false, label: "Exemple 2" },
    { id: "3", enabled: false, label: "Exemple 3" },
    { id: "4", enabled: false, label: "Exemple 4" },
    { id: "5", enabled: false, label: "Exemple 5" },
  ])
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
        if (params.id) {
          setIsInitializing(true)
          const { data, error } = await agentService.getAgentById(params.id)
          if (data) {
            // Update context with loaded data
            updateAgentData({
              id: params.id,
              name: data.name,
              status: data.status,
            })
            setAgentId(params.id)
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

  // Gestionnaires d'événements
  const handlePrevious = async () => {
    try {
      setIsLoading(true)
      await saveData()
      router.push(`/agents/${params.id}/informations`)
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
      router.push(`/agents/${params.id}/recapitulatif`)
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
      voiceGender: gender,
      voiceType,
      transferPhone,
      configOptions: options,
      integrations,
    }

    updateAgentData(updatedData)

    // Envoi au backend - only update the name and status in the database
    try {
      if (asDraft) {
        await agentService.saveAgentDraft({
          id: params.id,
          name: agentData.name,
          status: "draft",
        })
      } else {
        // Mise à jour d'un agent existant - only basic fields
        await agentService.updateAgent(params.id, {
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
    setExamples((prev) =>
      prev.map((example) => (example.id === id ? { ...example, enabled: !example.enabled } : example)),
    )
  }

  if (isInitializing) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <AgentCreationLayout agentId={params.id} activeTab="configuration">
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
      <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-full bg-purple-100">
            <Volume2 className="h-5 w-5 text-foreground" />
          </div>
          <h3 className="font-medium text-lg">Voix de l'agent</h3>
        </div>

        <div className="flex items-center justify-between">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-4">Genre</h4>
              <div className="flex gap-8">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={gender === "homme"}
                    onChange={() => setGender("homme")}
                    className="form-radio h-4 w-4 text-primary"
                  />
                  <span>Homme</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={gender === "femme"}
                    onChange={() => setGender("femme")}
                    className="form-radio h-4 w-4 text-primary"
                  />
                  <span>Femme</span>
                </label>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-4">Sélection de voix</h4>
              <div className="flex gap-8">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={voiceType === "enthousiaste"}
                    onChange={() => setVoiceType("enthousiaste")}
                    className="form-radio h-4 w-4 text-primary"
                  />
                  <span>Enthousiaste</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={voiceType === "professionnelle"}
                    onChange={() => setVoiceType("professionnelle")}
                    className="form-radio h-4 w-4 text-primary"
                  />
                  <span>Professionnelle</span>
                </label>
              </div>
            </div>
          </div>

          <Button variant="outline" className="flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            Écouter
          </Button>
        </div>
      </div>

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

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {examples.map((example) => (
            <div key={example.id} className="flex items-center gap-2">
              <Switch checked={example.enabled} onCheckedChange={() => toggleExample(example.id)} />
              <span className="text-sm">{example.label}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-4">
          <Button variant="ghost" className="text-primary flex items-center">
            <span className="mr-1">+</span> Ajouter une option
          </Button>
        </div>
      </div>

      {/* Section Options */}
      <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-full bg-gray-100">
            <Settings className="h-5 w-5 text-foreground" />
          </div>
          <h3 className="font-medium text-lg">Options</h3>
        </div>

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
      </div>

      {/* Section Intégrations */}
      <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-full bg-yellow-100">
            <Database className="h-5 w-5 text-foreground" />
          </div>
          <h3 className="font-medium text-lg">Intégrations</h3>
        </div>

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
      </div>

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
