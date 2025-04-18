import type { ReactNode } from "react"

interface FormFieldProps {
  label: string
  description?: string
  required?: boolean
  children: ReactNode
}

export function FormField({ label, description, required = false, children }: FormFieldProps) {
  return (
    <div className="mb-6">
      <div className="flex items-baseline mb-2">
        <label className="text-base font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {description && <span className="ml-2 text-xs text-muted-foreground">{description}</span>}
      </div>
      {children}
    </div>
  )
}
