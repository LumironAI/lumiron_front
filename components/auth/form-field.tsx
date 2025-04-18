import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface FormFieldProps {
  label: string
  required?: boolean
  error?: string
  className?: string
  children: ReactNode
}

export function FormField({ label, required = false, error, className, children }: FormFieldProps) {
  return (
    <div className={cn("mb-4", className)}>
      <label className="block text-sm font-medium mb-1 text-foreground">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}
