"use client"

import { useState } from "react"
import { Database } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { SectionCard } from "@/components/agent-creation/common/section-card"

interface Integration {
  id: string
  name: string
  description: string
  enabled: boolean
  fields?: {
    id: string
    label: string
    value: string
  }[]
}

interface IntegrationsSectionProps {
  initialIntegrations?: Integration[]
  onIntegrationsChange?: (integrations: Integration[]) => void
}

export function IntegrationsSection({
  initialIntegrations = [
    {
      id: "thefork",
      name: "TheFork",
      description: "Connecter votre compte",
      enabled: false,
    },
    {
      id: "zenchef",
      name: "ZenChef",
      description: "Connecter votre compte",
      enabled: false,
      fields: [
        { id: "api", label: "Clé API", value: "" },
        { id: "restaurant", label: "ID restaurant", value: "" },
      ],
    },
    {
      id: "sevenrooms",
      name: "SevenRooms",
      description: "Connecter votre compte",
      enabled: false,
    },
    {
      id: "custom",
      name: "Système personnalisé",
      description: "Connecter votre compte",
      enabled: false,
    },
  ],
  onIntegrationsChange,
}: IntegrationsSectionProps) {
  const [integrations, setIntegrations] = useState<Integration[]>(initialIntegrations)

  const handleIntegrationToggle = (id: string, enabled: boolean) => {
    const updatedIntegrations = integrations.map((integration) =>
      integration.id === id ? { ...integration, enabled } : integration,
    )
    setIntegrations(updatedIntegrations)
    onIntegrationsChange?.(updatedIntegrations)
  }

  const handleFieldChange = (integrationId: string, fieldId: string, value: string) => {
    const updatedIntegrations = integrations.map((integration) => {
      if (integration.id === integrationId && integration.fields) {
        const updatedFields = integration.fields.map((field) => (field.id === fieldId ? { ...field, value } : field))
        return { ...integration, fields: updatedFields }
      }
      return integration
    })
    setIntegrations(updatedIntegrations)
    onIntegrationsChange?.(updatedIntegrations)
  }

  return (
    <SectionCard icon={<Database className="h-5 w-5" />} title="Intégrations" iconColor="bg-yellow-100">
      <div className="space-y-6">
        {integrations.map((integration) => (
          <div key={integration.id} className="border-b pb-4 last:border-0 last:pb-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                  {/* Placeholder pour l'icône de l'intégration */}
                </div>
                <div>
                  <div className="font-medium">{integration.name}</div>
                  <div className="text-xs text-gray-500">{integration.description}</div>
                </div>
              </div>
              <Switch
                checked={integration.enabled}
                onCheckedChange={(checked) => handleIntegrationToggle(integration.id, checked)}
              />
            </div>

            {integration.enabled && integration.fields && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pl-8">
                {integration.fields.map((field) => (
                  <div key={field.id}>
                    <label className="block text-xs font-medium mb-1">{field.label}</label>
                    <Input
                      value={field.value}
                      onChange={(e) => handleFieldChange(integration.id, field.id, e.target.value)}
                      className="text-sm"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </SectionCard>
  )
}
