import type { ReactNode } from "react"

interface FormRowProps {
  children: ReactNode
}

export function FormRow({ children }: FormRowProps) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">{children}</div>
}
