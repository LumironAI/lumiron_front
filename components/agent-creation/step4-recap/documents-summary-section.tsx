"use client"

import { FileText, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SectionCard } from "@/components/agent-creation/common/section-card"

interface Document {
  id: string
  name: string
}

interface DocumentsSummaryProps {
  documents?: Document[]
  onPreview?: (documentId: string) => void
}

export function DocumentsSummarySection({ documents = [], onPreview }: DocumentsSummaryProps) {
  return (
    <SectionCard icon={<FileText className="h-5 w-5" />} title="Documents associés" iconColor="bg-blue-100">
      {documents.length > 0 ? (
        <div className="space-y-2">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-2 border rounded-md">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{doc.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onPreview?.(doc.id)} className="text-primary">
                <Eye className="h-4 w-4 mr-1" />
                Aperçu
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-gray-500">Aucun document associé</div>
      )}
    </SectionCard>
  )
}
