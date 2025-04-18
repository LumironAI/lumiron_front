"use client"

import { Button } from "@/components/ui/button"

interface ActionButtonsProps {
  onPrevious?: () => void
  onSaveAsDraft: () => void
  onContinue: () => void
  disabled?: boolean
  showPrevious?: boolean
  showValidate?: boolean
}

export function ActionButtons({
  onPrevious,
  onSaveAsDraft,
  onContinue,
  disabled = false,
  showPrevious = true,
  showValidate = false,
}: ActionButtonsProps) {
  return (
    <div className="flex justify-between mt-8">
      <div>
        {showPrevious && (
          <Button variant="outline" onClick={onPrevious} disabled={disabled}>
            Précédent
          </Button>
        )}
      </div>
      <div className="flex gap-4">
        <Button variant="outline" onClick={onSaveAsDraft} disabled={disabled}>
          Enregistrer comme brouillon
        </Button>
        <Button onClick={onContinue} disabled={disabled}>
          {showValidate ? "Valider" : "Continuer"}
        </Button>
      </div>
    </div>
  )
}
