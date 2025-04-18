import { Database } from "lucide-react"
import { SectionCard } from "@/components/agent-creation/common/section-card"

interface Integration {
  id: string
  name: string
  enabled: boolean
  fields?: {
    id: string
    label: string
    value: string
  }[]
}

interface IntegrationsSummaryProps {
  integrations?: Integration[]
}

export function IntegrationsSummarySection({ integrations = [] }: IntegrationsSummaryProps) {
  return (
    <SectionCard icon={<Database className="h-5 w-5" />} title="Intégrations" iconColor="bg-yellow-100">
      {integrations.length > 0 ? (
        <div className="space-y-8 bg-[#FFF9D8] p-6 rounded-lg">
          {integrations.map((integration) => (
            <div key={integration.id} className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-200">
                  {integration.id === "thefork" && <span className="text-sm font-bold">T</span>}
                  {integration.id === "zenchef" && <span className="text-sm font-bold">Z</span>}
                  {integration.id === "sevenrooms" && <span className="text-sm font-bold">S</span>}
                  {integration.id === "custom" && <span className="text-sm font-bold">C</span>}
                </div>
                <h3 className="font-medium text-lg">{integration.name}</h3>
              </div>

              {integration.fields && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {integration.fields.map((field) => (
                    <div key={field.id} className="space-y-1">
                      <div className="text-xs text-gray-500">{field.label}</div>
                      <div className="font-medium text-sm">{field.value || "[Non renseigné]"}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-gray-500">Aucune intégration activée</div>
      )}
    </SectionCard>
  )
}
