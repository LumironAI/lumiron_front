import { Settings, PhoneForwarded, CheckCircle2, XCircle } from "lucide-react"
import { SectionCard } from "@/components/agent-creation/common/section-card"

interface ConfigOption {
  id: string
  label: string
  description?: string
  enabled: boolean
}

interface ConfigSummaryProps {
  transferPhone?: string
  configOptions?: ConfigOption[]
}

export function ConfigSummarySection({ transferPhone, configOptions }: ConfigSummaryProps) {
  return (
    <SectionCard 
      icon={<Settings className="h-5 w-5" />} 
      title="Configuration spécifique" 
      iconColor="bg-purple-100" // Using a different color for distinction
    >
      <div className="space-y-4">
        {/* Transfer Phone */}
        {transferPhone !== undefined && (
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-gray-100 rounded-md">
              <PhoneForwarded className="h-4 w-4 text-gray-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Numéro de transfert d'appel</div>
              <div className="font-medium">{transferPhone || "[Non défini]"}</div>
            </div>
          </div>
        )}

        {/* Config Options */}
        {configOptions && configOptions.length > 0 && (
          <div>
            <div className="text-sm text-gray-500 mb-2">Options de configuration :</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {configOptions.map((option) => (
                <div key={option.id} className="flex items-center gap-2">
                  {option.enabled ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-gray-300 flex-shrink-0" />
                  )}
                  <span className="text-sm">{option.label}</span>
                  {option.description && (
                    <span className="text-xs text-gray-400">({option.description})</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  )
} 