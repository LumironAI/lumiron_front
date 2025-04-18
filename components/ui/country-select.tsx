"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const countries = [
  { value: "fr", label: "FR", code: "+33" },
  { value: "us", label: "US", code: "+1" },
  { value: "gb", label: "GB", code: "+44" },
  { value: "de", label: "DE", code: "+49" },
  { value: "es", label: "ES", code: "+34" },
  { value: "it", label: "IT", code: "+39" },
  { value: "ch", label: "CH", code: "+41" },
  { value: "be", label: "BE", code: "+32" },
  { value: "ca", label: "CA", code: "+1" },
]

interface CountrySelectProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function CountrySelect({ value, onChange, disabled = false }: CountrySelectProps) {
  const [open, setOpen] = React.useState(false)
  const selectedCountry = countries.find((country) => country.value === value) || countries[0]

  // Référence pour suivre si un clic a été traité
  const clickProcessedRef = React.useRef(false)

  // Gestionnaire pour le clic sur le déclencheur
  const handleTriggerClick = (e: React.MouseEvent) => {
    // Empêcher la propagation et le comportement par défaut
    e.preventDefault()
    e.stopPropagation()

    // Inverser l'état ouvert/fermé
    setOpen(!open)

    // Marquer le clic comme traité
    clickProcessedRef.current = true

    // Réinitialiser le drapeau après un court délai
    setTimeout(() => {
      clickProcessedRef.current = false
    }, 100)
  }

  // Gestionnaire pour la sélection d'un élément
  const handleSelect = (currentValue: string) => {
    // Appeler le callback onChange
    onChange(currentValue)

    // Fermer le popover
    setOpen(false)
  }

  // Gestionnaire pour le changement d'état du popover
  const handleOpenChange = (newOpen: boolean) => {
    // Ne pas fermer le popover si un clic vient d'être traité
    if (clickProcessedRef.current && !newOpen) return

    setOpen(newOpen)
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Sélectionner un pays"
          className="w-[85px] justify-between rounded-r-none border-r-0 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          onClick={handleTriggerClick}
          type="button" // Explicitement défini comme button pour éviter la soumission du formulaire
          disabled={disabled}
        >
          {selectedCountry.label} {selectedCountry.code}
          <ChevronsUpDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 dark:bg-gray-800 dark:border-gray-700" align="start">
        <Command className="dark:bg-gray-800">
          <CommandInput
            placeholder="Rechercher un pays..."
            className="dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
            onKeyDown={(e) => {
              // Empêcher la soumission du formulaire lors de l'appui sur Entrée
              if (e.key === "Enter") {
                e.preventDefault()
                e.stopPropagation()
              }
            }}
          />
          <CommandList className="dark:bg-gray-800">
            <CommandEmpty className="dark:text-gray-400">Aucun pays trouvé.</CommandEmpty>
            <CommandGroup>
              {countries.map((country) => (
                <CommandItem
                  key={country.value}
                  value={country.value}
                  onSelect={(currentValue) => {
                    handleSelect(currentValue)
                  }}
                  onMouseDown={(e) => {
                    // Empêcher la perte de focus qui pourrait fermer le popover
                    e.preventDefault()
                  }}
                  className="cursor-pointer dark:text-gray-100 dark:hover:bg-gray-700"
                >
                  <Check className={cn("mr-2 h-4 w-4", value === country.value ? "opacity-100" : "opacity-0")} />
                  {country.label} {country.code}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
