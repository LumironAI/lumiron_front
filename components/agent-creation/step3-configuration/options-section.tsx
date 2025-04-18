"use client"

import { useState } from "react"
import { Settings } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { SectionCard } from "@/components/agent-creation/common/section-card"

interface OptionItem {
  id: string
  label: string
  description?: string
  enabled: boolean
}

interface OptionsSectionProps {
  initialOptions?: OptionItem[]
  onOptionsChange?: (options: OptionItem[]) => void
}

export function OptionsSection({
  initialOptions = [
    {
      id: "sms",
      label: "SMS",
      description: "Activer l'envoi de SMS (0.15 centimes / SMS)",
      enabled: false,
    },
    {
      id: "autres",
      label: "Autres",
      enabled: false,
    },
  ],
  onOptionsChange,
}: OptionsSectionProps) {
  const [options, setOptions] = useState<OptionItem[]>(initialOptions)

  const handleOptionToggle = (id: string, enabled: boolean) => {
    const updatedOptions = options.map((option) => (option.id === id ? { ...option, enabled } : option))
    setOptions(updatedOptions)
    onOptionsChange?.(updatedOptions)
  }

  return (
    <SectionCard icon={<Settings className="h-5 w-5" />} title="Options" iconColor="bg-gray-100">
      <div className="space-y-4">
        {options.map((option) => (
          <div key={option.id} className="flex items-center justify-between">
            <div>
              <div className="font-medium">{option.label}</div>
              {option.description && <div className="text-sm text-gray-500">{option.description}</div>}
            </div>
            <Switch checked={option.enabled} onCheckedChange={(checked) => handleOptionToggle(option.id, checked)} />
          </div>
        ))}
      </div>
    </SectionCard>
  )
}
