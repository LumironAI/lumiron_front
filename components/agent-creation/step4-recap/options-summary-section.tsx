import { Settings } from "lucide-react"
import { SectionCard } from "@/components/agent-creation/common/section-card"
import { CheckCircle2, XCircle } from "lucide-react"

interface OptionsSummaryProps {
  options?: { [key: string]: boolean }
  foodOptions?: { [key: string]: boolean }
}

export function OptionsSummarySection({ options, foodOptions }: OptionsSummaryProps) {
  const getEnabledOptions = (opts?: { [key: string]: boolean }) => {
    if (!opts) return []
    return Object.entries(opts)
      .filter(([_, enabled]) => enabled)
      .map(([name]) => name)
  }

  const enabledOptions = getEnabledOptions(options)
  const enabledFoodOptions = getEnabledOptions(foodOptions)

  return (
    <>
      <SectionCard icon={<Settings className="h-5 w-5" />} title="Options & services" iconColor="bg-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {options &&
            Object.entries(options).map(([option, enabled]) => (
              <div key={option} className="flex items-center gap-2">
                {enabled ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-gray-300" />
                )}
                <span className="text-sm">{option}</span>
              </div>
            ))}
        </div>
      </SectionCard>

      <SectionCard icon={<Settings className="h-5 w-5" />} title="Options alimentaires" iconColor="bg-yellow-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {foodOptions &&
            Object.entries(foodOptions).map(([option, enabled]) => (
              <div key={option} className="flex items-center gap-2">
                {enabled ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-gray-300" />
                )}
                <span className="text-sm">{option}</span>
              </div>
            ))}
        </div>
      </SectionCard>
    </>
  )
}
