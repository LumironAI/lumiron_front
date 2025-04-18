"use client"

import { SectorOption } from "./sector-option"
import {
  Utensils,
  HeadphonesIcon,
  Building2,
  Target,
  FileText,
  ShoppingCart,
  Stethoscope,
  Building,
} from "lucide-react"

interface SectorGridProps {
  selectedSector: string
  onSectorChange: (sector: string) => void
}

export function SectorGrid({ selectedSector, onSectorChange }: SectorGridProps) {
  const sectors = [
    {
      id: "restaurant",
      label: "Restaurant",
      icon: <Utensils className="h-6 w-6" />,
      disabled: false,
    },
    {
      id: "support-client",
      label: "Support client",
      icon: <HeadphonesIcon className="h-6 w-6" />,
      disabled: false,
    },
    {
      id: "immobilier",
      label: "Immobilier",
      icon: <Building2 className="h-6 w-6" />,
      disabled: false,
    },
    {
      id: "qualification",
      label: "Qualification de prospects",
      icon: <Target className="h-6 w-6" />,
      disabled: false,
    },
    {
      id: "assurance",
      label: "Assurance",
      icon: <FileText className="h-6 w-6" />,
      disabled: false,
    },
    {
      id: "e-commerce",
      label: "E-commerce",
      icon: <ShoppingCart className="h-6 w-6" />,
      disabled: false,
    },
    {
      id: "sante",
      label: "Santé/Médecin",
      icon: <Stethoscope className="h-6 w-6" />,
      disabled: false,
    },
    {
      id: "hotellerie",
      label: "Hôtellerie & voyage",
      icon: <Building className="h-6 w-6" />,
      disabled: false,
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {sectors.map((sector) => (
        <SectorOption
          key={sector.id}
          id={sector.id}
          icon={sector.icon}
          label={sector.label}
          selected={selectedSector === sector.id}
          onSelect={onSectorChange}
          disabled={sector.disabled}
        />
      ))}
    </div>
  )
}
