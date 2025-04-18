"use client"

import { useState, useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { TimeInput } from "@/components/agent-creation/step2-informations/time-input"

interface MealPeriod {
  open: boolean
  start: string
  end: string
}

export interface OpeningHoursRowProps {
  day: string
  lunchHours?: MealPeriod
  dinnerHours?: MealPeriod
  onToggle?: (day: string, period: "lunch" | "dinner", isOpen: boolean) => void
  onTimeChange?: (day: string, period: "lunch" | "dinner", type: "start" | "end", time: string) => void
}

export function OpeningHoursRow({
  day,
  lunchHours = { open: false, start: "12:00", end: "14:30" },
  dinnerHours = { open: false, start: "19:00", end: "22:30" },
  onToggle,
  onTimeChange,
}: OpeningHoursRowProps) {
  const [isLunchOpen, setIsLunchOpen] = useState(lunchHours.open)
  const [isDinnerOpen, setIsDinnerOpen] = useState(dinnerHours.open)
  const [lunchStart, setLunchStart] = useState(lunchHours.start)
  const [lunchEnd, setLunchEnd] = useState(lunchHours.end)
  const [dinnerStart, setDinnerStart] = useState(dinnerHours.start)
  const [dinnerEnd, setDinnerEnd] = useState(dinnerHours.end)

  // Update state if props change
  useEffect(() => {
    setIsLunchOpen(lunchHours.open)
    setLunchStart(lunchHours.start)
    setLunchEnd(lunchHours.end)
  }, [lunchHours])

  useEffect(() => {
    setIsDinnerOpen(dinnerHours.open)
    setDinnerStart(dinnerHours.start)
    setDinnerEnd(dinnerHours.end)
  }, [dinnerHours])

  const handleLunchToggle = (checked: boolean) => {
    setIsLunchOpen(checked)
    onToggle?.(day, "lunch", checked)
  }

  const handleDinnerToggle = (checked: boolean) => {
    setIsDinnerOpen(checked)
    onToggle?.(day, "dinner", checked)
  }

  const handleLunchStartChange = (time: string) => {
    setLunchStart(time)
    onTimeChange?.(day, "lunch", "start", time)
  }

  const handleLunchEndChange = (time: string) => {
    setLunchEnd(time)
    onTimeChange?.(day, "lunch", "end", time)
  }

  const handleDinnerStartChange = (time: string) => {
    setDinnerStart(time)
    onTimeChange?.(day, "dinner", "start", time)
  }

  const handleDinnerEndChange = (time: string) => {
    setDinnerEnd(time)
    onTimeChange?.(day, "dinner", "end", time)
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
            <TimeInput value={lunchStart} onChange={handleLunchStartChange} />
            <span>-</span>
            <TimeInput value={lunchEnd} onChange={handleLunchEndChange} />
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
            <TimeInput value={dinnerStart} onChange={handleDinnerStartChange} />
            <span>-</span>
            <TimeInput value={dinnerEnd} onChange={handleDinnerEndChange} />
          </>
        ) : (
          <span className="text-sm text-muted-foreground text-center w-full">Fermé</span>
        )}
      </div>
    </div>
  )
}
