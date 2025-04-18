import { CalendarX } from "lucide-react"
import { SectionCard } from "@/components/agent-creation/common/section-card"

interface ClosurePeriod {
  start: string
  end: string
}

interface ClosureSummaryProps {
  closurePeriods?: ClosurePeriod[]
}

export function ClosureSummarySection({ closurePeriods = [] }: ClosureSummaryProps) {
  return (
    <SectionCard icon={<CalendarX className="h-5 w-5" />} title="Période de Fermeture" iconColor="bg-red-100">
      <div className="flex flex-wrap gap-2">
        {closurePeriods.length > 0 ? (
          closurePeriods.map((period, index) => (
            <div key={index} className="bg-gray-100 px-3 py-2 rounded-md text-sm">
              Du {period.start} au {period.end}
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-500">Aucune période de fermeture définie</div>
        )}
      </div>
    </SectionCard>
  )
}
