"use client"

import type React from "react"

import { useState } from "react"
import { Phone } from "lucide-react"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { SectionCard } from "@/components/agent-creation/common/section-card"

interface PhoneNumberSectionProps {
  initialPhoneNumber?: string
  initialDeviceType?: "apple" | "autres"
  onPhoneNumberChange?: (value: string) => void
  onDeviceTypeChange?: (value: "apple" | "autres") => void
}

export function PhoneNumberSection({
  initialPhoneNumber = "",
  initialDeviceType = "apple",
  onPhoneNumberChange,
  onDeviceTypeChange,
}: PhoneNumberSectionProps) {
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber)
  const [deviceType, setDeviceType] = useState<"apple" | "autres">(initialDeviceType)

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPhoneNumber(value)
    onPhoneNumberChange?.(value)
  }

  const handleDeviceTypeChange = (value: "apple" | "autres") => {
    setDeviceType(value)
    onDeviceTypeChange?.(value)
  }

  return (
    <SectionCard icon={<Phone className="h-5 w-5" />} title="Numéro de votre agent:" iconColor="bg-green-100">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-gray-500">+</span>
        <Input
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          placeholder="33 6 12 34 56 78"
          className="max-w-xs"
        />
      </div>

      <p className="text-sm text-gray-500 mb-4">
        Pour transférer votre numéro, veuillez remplir les informations ci-dessous en fonction de votre type d'appareil
      </p>

      <RadioGroup
        value={deviceType}
        onValueChange={(value) => handleDeviceTypeChange(value as "apple" | "autres")}
        className="flex gap-8"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="apple" id="apple" />
          <Label htmlFor="apple">Apple</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="autres" id="autres" />
          <Label htmlFor="autres">Autres</Label>
        </div>
      </RadioGroup>

      {deviceType === "autres" && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-100 p-4 rounded-md">
            {/* Placeholder pour l'image ou les instructions spécifiques */}
          </div>
          <div className="bg-gray-100 p-4 rounded-md">
            <h4 className="font-medium mb-2">Comment transférer votre numéro</h4>
            <ol className="list-decimal pl-5 space-y-2 text-sm">
              <li>Ouvrez l'application Téléphone sur votre appareil</li>
              <li>Accédez au clavier de numérotation</li>
              <li>Composez la commande suivante :</li>
              <div className="bg-white p-2 rounded my-1">
                <code>*21*+33 6 12 34 56 78</code>
              </div>
              <li>Appuyez sur le bouton d'appel</li>
            </ol>
          </div>
        </div>
      )}
    </SectionCard>
  )
}
