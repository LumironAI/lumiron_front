"use client"

import type React from "react"

import { useState } from "react"
import { UserPlus, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { SectionCard } from "@/components/agent-creation/common/section-card"

interface TransferExample {
  id: string
  enabled: boolean
  label: string
}

interface TransferSectionProps {
  initialPhoneNumber?: string
  initialExamples?: TransferExample[]
  onPhoneNumberChange?: (value: string) => void
  onExamplesChange?: (examples: TransferExample[]) => void
}

export function TransferSection({
  initialPhoneNumber = "",
  initialExamples = [
    { id: "1", enabled: false, label: "Exemple 1" },
    { id: "2", enabled: false, label: "Exemple 2" },
    { id: "3", enabled: false, label: "Exemple 3" },
    { id: "4", enabled: false, label: "Exemple 4" },
    { id: "5", enabled: false, label: "Exemple 5" },
  ],
  onPhoneNumberChange,
  onExamplesChange,
}: TransferSectionProps) {
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber)
  const [examples, setExamples] = useState<TransferExample[]>(initialExamples)

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPhoneNumber(value)
    onPhoneNumberChange?.(value)
  }

  const handleExampleToggle = (id: string, enabled: boolean) => {
    const updatedExamples = examples.map((example) => (example.id === id ? { ...example, enabled } : example))
    setExamples(updatedExamples)
    onExamplesChange?.(updatedExamples)
  }

  return (
    <SectionCard
      icon={<UserPlus className="h-5 w-5" />}
      title="Transfert d'appel à un humain"
      iconColor="bg-orange-100"
    >
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Rentrer votre numéro de téléphone :</label>
        <div className="flex items-center gap-2">
          <div className="bg-gray-100 px-2 py-1 rounded text-sm">FR + 33</div>
          <Input
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            placeholder="6 12 34 56 78"
            className="max-w-xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {examples.map((example) => (
          <div key={example.id} className="flex items-center gap-2">
            <Switch checked={example.enabled} onCheckedChange={(checked) => handleExampleToggle(example.id, checked)} />
            <span className="text-sm">{example.label}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-4">
        <Button variant="ghost" className="text-primary flex items-center">
          <Plus className="h-4 w-4 mr-1" /> <span>Ajouter une option</span>
        </Button>
      </div>
    </SectionCard>
  )
}
