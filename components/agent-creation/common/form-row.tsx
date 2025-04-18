import type { ReactNode } from "react"

export interface FormRowProps {
  children: ReactNode
  label?: string
  required?: boolean
  error?: string
}

export function FormRow({ children, label, required, error }: FormRowProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {label && (
        <div className="flex items-center">
          <label className="text-sm font-medium">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        </div>
      )}
      <div className="w-full">
        {children}
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>
    </div>
  )
}
