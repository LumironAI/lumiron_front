"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"

interface TimeInputProps {
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
}

export function TimeInput({ value = "", onChange, disabled = false }: TimeInputProps) {
  const [time, setTime] = useState(value)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setTime(newValue)
    onChange?.(newValue)
  }

  return (
    <Input
      type="time"
      value={time}
      onChange={handleChange}
      className="w-16 text-center px-1 h-8 text-sm"
      disabled={disabled}
    />
  )
}
