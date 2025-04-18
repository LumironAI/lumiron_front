import { Info } from "lucide-react"
import { SectionCard } from "@/components/agent-creation/common/section-card"

interface InfoSummaryProps {
  agentName: string
  sector: string
  establishment?: string
  website?: string
  address?: string
  city?: string
  phoneNumber?: string
  deviceType?: string
  additionalInfo?: string
}

export function InfoSummarySection({
  agentName,
  sector,
  establishment,
  website,
  address,
  city,
  phoneNumber,
  deviceType,
  additionalInfo,
}: InfoSummaryProps) {
  return (
    <SectionCard icon={<Info className="h-5 w-5" />} title="Informations générales" iconColor="bg-blue-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
        <div>
          <div className="text-sm text-gray-500">Nom de l'agent</div>
          <div className="font-medium">{agentName || "[Nom de l'agent]"}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Secteur d'activité</div>
          <div className="font-medium">{sector || "[Nom du secteur]"}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Nom de l'établissement</div>
          <div className="font-medium">{establishment || "[Nom du secteur]"}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">URL du site / Facebook</div>
          <div className="font-medium">{website || "[+33 6 12 34 56 78]"}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Adresse postale</div>
          <div className="font-medium">{address || "[Numéro, nom de rue, ville]"}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Appareil utilisé</div>
          <div className="font-medium">{deviceType || "[Apple ou Autres]"}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Numéro de téléphone</div>
          <div className="font-medium">{phoneNumber || "[+33 6 12 34 56 78]"}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Informations complémentaires</div>
          <div className="font-medium">{additionalInfo || "[Infos complémentaires]"}</div>
        </div>
      </div>
    </SectionCard>
  )
}
