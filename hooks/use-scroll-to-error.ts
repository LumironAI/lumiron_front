"use client"

import { useEffect, useRef } from "react"

export function useScrollToError<T extends Record<string, boolean>>(
  errors: T,
  isSubmitted: boolean,
  options?: {
    offset?: number
    behavior?: ScrollBehavior
  },
) {
  const errorsRef = useRef<HTMLDivElement>(null)
  const hasErrors = Object.values(errors).some(Boolean)

  useEffect(() => {
    if (isSubmitted && hasErrors && errorsRef.current) {
      const { top } = errorsRef.current.getBoundingClientRect()
      const offset = options?.offset || 100

      window.scrollTo({
        top: window.scrollY + top - offset,
        behavior: options?.behavior || "smooth",
      })
    }
  }, [isSubmitted, hasErrors, options])

  return { errorsRef, hasErrors }
}
