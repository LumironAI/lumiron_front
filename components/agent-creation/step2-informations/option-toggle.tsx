"use client"

import { useState, useEffect } from "react"
import { Switch } from "@/components/ui/switch"

export interface OptionToggleProps {
  label: string
  checked?: boolean
  initialValue?: boolean
  onChange?: (checked: boolean) => void
  onCheckedChange?: (checked: boolean) => void
}

export function OptionToggle({ 
  label, 
  initialValue = false, 
  checked, 
  onChange, 
  onCheckedChange 
}: OptionToggleProps) {
  const [isChecked, setIsChecked] = useState(checked !== undefined ? checked : initialValue)

  // Update state when checked prop changes
  useEffect(() => {
    if (checked !== undefined) {
      setIsChecked(checked)
    }
  }, [checked])

  const handleChange = (value: boolean) => {
    setIsChecked(value)
    if (onChange) onChange(value)
    if (onCheckedChange) onCheckedChange(value)
  }

  return (
    <div className="flex items-center py-1.5">
      <Switch 
        checked={isChecked} 
        onCheckedChange={handleChange} 
        className="mr-3 h-4 w-8 data-[state=checked]:bg-blue-500"
      />
      <span className="text-sm text-gray-700">{label}</span>
    </div>
  )
}
