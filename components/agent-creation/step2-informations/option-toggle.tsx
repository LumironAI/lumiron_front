"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"

interface OptionToggleProps {
  label: string
  initialValue?: boolean
  onChange?: (checked: boolean) => void
}

export function OptionToggle({ label, initialValue = false, onChange }: OptionToggleProps) {
  const [checked, setChecked] = useState(initialValue)

  const handleChange = (value: boolean) => {
    setChecked(value)
    onChange?.(value)
  }

  return (
    <div className="flex items-center py-2.5">
      <Switch checked={checked} onCheckedChange={handleChange} className="mr-3" />
      <span className="text-sm text-foreground">{label}</span>
    </div>
  )
}
