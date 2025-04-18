"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"

interface SearchBarProps {
  placeholder?: string
  onChange?: (value: string) => void
  value?: string
}

export function SearchBar({ placeholder = "Rechercher...", onChange, value: externalValue }: SearchBarProps) {
  const [value, setValue] = useState(externalValue || "")

  // Sync with external value
  useEffect(() => {
    if (externalValue !== undefined && externalValue !== value) {
      setValue(externalValue)
    }
  }, [externalValue])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    onChange?.(newValue)
  }

  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="w-4 h-4 text-gray-400" />
      </div>
      <input
        type="text"
        className="w-full py-2 pl-10 pr-4 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
    </div>
  )
}
