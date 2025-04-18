import { Volume2 } from "lucide-react"
import { SectionCard } from "@/components/agent-creation/common/section-card"

interface VoiceSummaryProps {
  gender?: "homme" | "femme"
  voiceType?: "enthousiaste" | "professionnelle"
}

export function VoiceSummarySection({ gender, voiceType }: VoiceSummaryProps) {
  const displayGender = gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : "Homme"
  const displayVoiceType = voiceType ? voiceType.charAt(0).toUpperCase() + voiceType.slice(1) : "Enthousiaste"

  return (
    <SectionCard icon={<Volume2 className="h-5 w-5" />} title="Configuration de l'agent" iconColor="bg-purple-100">
      <div className="space-y-4">
        <div>
          <div className="text-sm text-gray-500">Voix de l'agent</div>
          <div className="font-medium flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            {displayGender} {displayVoiceType}
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-500">Options activées</div>
          <div className="font-medium">SMS (4,99 € / mois)</div>
        </div>
      </div>
    </SectionCard>
  )
}
