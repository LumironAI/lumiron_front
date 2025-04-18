"use client"

import { useState } from "react"
import { Volume2 } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { SectionCard } from "@/components/agent-creation/common/section-card"

interface VoiceSectionProps {
  initialGender?: "homme" | "femme"
  initialVoiceType?: "enthousiaste" | "professionnelle"
  onGenderChange?: (value: "homme" | "femme") => void
  onVoiceTypeChange?: (value: "enthousiaste" | "professionnelle") => void
}

export function VoiceSection({
  initialGender = "homme",
  initialVoiceType = "enthousiaste",
  onGenderChange,
  onVoiceTypeChange,
}: VoiceSectionProps) {
  const [gender, setGender] = useState<"homme" | "femme">(initialGender)
  const [voiceType, setVoiceType] = useState<"enthousiaste" | "professionnelle">(initialVoiceType)

  const handleGenderChange = (value: "homme" | "femme") => {
    setGender(value)
    onGenderChange?.(value)
  }

  const handleVoiceTypeChange = (value: "enthousiaste" | "professionnelle") => {
    setVoiceType(value)
    onVoiceTypeChange?.(value)
  }

  return (
    <SectionCard icon={<Volume2 className="h-5 w-5" />} title="Voix de l'agent" iconColor="bg-purple-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="font-medium mb-4">Genre</h4>
          <RadioGroup
            value={gender}
            onValueChange={(value) => handleGenderChange(value as "homme" | "femme")}
            className="flex gap-8"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="homme" id="homme" />
              <Label htmlFor="homme">Homme</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="femme" id="femme" />
              <Label htmlFor="femme">Femme</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <h4 className="font-medium mb-4">Sélection de voix</h4>
          <RadioGroup
            value={voiceType}
            onValueChange={(value) => handleVoiceTypeChange(value as "enthousiaste" | "professionnelle")}
            className="flex gap-8"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="enthousiaste" id="enthousiaste" />
              <Label htmlFor="enthousiaste">Enthousiaste</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="professionnelle" id="professionnelle" />
              <Label htmlFor="professionnelle">Professionnelle</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <Button variant="outline" className="flex items-center gap-2">
          <Volume2 className="h-4 w-4" />
          Écouter
        </Button>
      </div>
    </SectionCard>
  )
}
