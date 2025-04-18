"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SectorOptionProps {
  id: string
  icon: ReactNode
  label: string
  selected: boolean
  onSelect: (id: string) => void
  disabled?: boolean
}

export function SectorOption({ id, icon, label, selected, onSelect, disabled = false }: SectorOptionProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center p-4 border rounded-lg transition-all",
        selected ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
      )}
      onClick={() => !disabled && onSelect(id)}
    >
      <div className="mb-3">{icon}</div>
      <div className="text-sm text-center">{label}</div>
      <div className="mt-2">
        <div
          className={cn(
            "w-5 h-5 rounded-full border flex items-center justify-center",
            selected ? "border-primary" : "border-gray-300",
          )}
        >
          {selected && <div className="w-3 h-3 rounded-full bg-primary" />}
        </div>
      </div>
      {disabled && <div className="mt-1 text-xs text-gray-500">Bientôt disponible</div>}
    </div>
  )
}
