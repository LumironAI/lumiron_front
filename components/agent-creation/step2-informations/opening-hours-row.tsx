"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { TimeInput } from "@/components/agent-creation/step2-informations/time-input"

interface OpeningHoursRowProps {
  day: string
  initialLunch?: boolean
  initialDinner?: boolean
  onLunchChange?: (isOpen: boolean) => void
  onDinnerChange?: (isOpen: boolean) => void
}

export function OpeningHoursRow({
  day,
  initialLunch = false,
  initialDinner = false,
  onLunchChange,
  onDinnerChange,
}: OpeningHoursRowProps) {
  const [isLunchOpen, setIsLunchOpen] = useState(initialLunch)
  const [isDinnerOpen, setIsDinnerOpen] = useState(initialDinner)
  const [lunchStart, setLunchStart] = useState("12:00")
  const [lunchEnd, setLunchEnd] = useState("14:30")
  const [dinnerStart, setDinnerStart] = useState("19:00")
  const [dinnerEnd, setDinnerEnd] = useState("22:30")

  const handleLunchToggle = (checked: boolean) => {
    setIsLunchOpen(checked)
    onLunchChange?.(checked)
  }

  const handleDinnerToggle = (checked: boolean) => {
    setIsDinnerOpen(checked)
    onDinnerChange?.(checked)
  }

  return (
    <div className="grid grid-cols-7 items-center py-2 border-b">
      <div className="font-medium text-left">{day}</div>

      <div className="flex justify-center">
        <Switch checked={isLunchOpen} onCheckedChange={handleLunchToggle} />
      </div>

      <div className="col-span-2 flex justify-center gap-2 items-center">
        {isLunchOpen ? (
          <>
            <TimeInput value={lunchStart} onChange={setLunchStart} />
            <span>-</span>
            <TimeInput value={lunchEnd} onChange={setLunchEnd} />
          </>
        ) : (
          <span className="text-sm text-muted-foreground text-center w-full">Fermé</span>
        )}
      </div>

      <div className="flex justify-center">
        <Switch checked={isDinnerOpen} onCheckedChange={handleDinnerToggle} />
      </div>

      <div className="col-span-2 flex justify-center gap-2 items-center">
        {isDinnerOpen ? (
          <>
            <TimeInput value={dinnerStart} onChange={setDinnerStart} />
            <span>-</span>
            <TimeInput value={dinnerEnd} onChange={setDinnerEnd} />
          </>
        ) : (
          <span className="text-sm text-muted-foreground text-center w-full">Fermé</span>
        )}
      </div>
    </div>
  )
}
