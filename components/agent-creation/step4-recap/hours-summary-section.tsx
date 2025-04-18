import { Clock } from "lucide-react"
import { SectionCard } from "@/components/agent-creation/common/section-card"
import React from "react"

interface OpeningHours {
  [day: string]: {
    lunch: { open: boolean; start: string; end: string }
    dinner: { open: boolean; start: string; end: string }
  }
}

interface HoursSummaryProps {
  openingHours?: OpeningHours
}

export function HoursSummarySection({ openingHours }: HoursSummaryProps) {
  return (
    <SectionCard icon={<Clock className="h-5 w-5" />} title="Horaires d'ouvertures" iconColor="bg-green-100">
      <div className="grid grid-cols-4 gap-2 text-sm">
        <div className="font-medium">Jour</div>
        <div className="font-medium text-center">Midi</div>
        <div className="font-medium text-center">Soir</div>
        <div></div>

        {openingHours &&
          Object.entries(openingHours).map(([day, periods]) => (
            <React.Fragment key={day}>
              <div key={`${day}-day`} className="py-2">
                {day}
              </div>
              <div key={`${day}-lunch`} className="text-center py-2">
                {periods.lunch.open ? `${periods.lunch.start} - ${periods.lunch.end}` : "Fermé"}
              </div>
              <div key={`${day}-dinner`} className="text-center py-2">
                {periods.dinner.open ? `${periods.dinner.start} - ${periods.dinner.end}` : "Fermé"}
              </div>
              <div key={`${day}-spacer`}></div>
            </React.Fragment>
          ))}
      </div>
    </SectionCard>
  )
}
