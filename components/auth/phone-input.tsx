"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { CountrySelect } from "@/components/ui/country-select"
import { useState, useEffect } from "react"

interface PhoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  onCountryChange?: (country: string) => void
  countryValue?: string
}

export function PhoneInput({
  error,
  className,
  onCountryChange,
  countryValue = "fr",
  disabled = false,
  ...props
}: PhoneInputProps) {
  // État local pour le pays sélectionné
  const [country, setCountry] = useState(countryValue)

  // Synchroniser l'état local avec la prop countryValue
  useEffect(() => {
    if (countryValue !== country) {
      setCountry(countryValue)
    }
  }, [countryValue, country])

  // Gestionnaire pour le changement de pays
  const handleCountryChange = (value: string) => {
    setCountry(value)
    if (onCountryChange) {
      onCountryChange(value)
    }
  }

  return (
    <div className="flex w-full relative" onClick={(e) => e.stopPropagation()}>
      <CountrySelect value={country} onChange={handleCountryChange} disabled={disabled} />
      <Input
        type="tel"
        className={cn(
          "flex-1 rounded-l-none",
          error ? "border-red-500 focus-visible:ring-red-500" : "",
          "dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100",
          className,
        )}
        disabled={disabled}
        {...props}
      />
      {error && <div className="absolute -bottom-5 left-0 text-xs text-red-500">{error}</div>}
    </div>
  )
}
