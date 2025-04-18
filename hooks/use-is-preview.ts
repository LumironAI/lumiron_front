"use client"

import { useState, useEffect } from "react"

export function useIsPreview() {
  const [isPreview, setIsPreview] = useState(false)

  useEffect(() => {
    // Check if we're in development or preview mode
    setIsPreview(
      process.env.NODE_ENV === "development" ||
        process.env.NEXT_PUBLIC_VERCEL_ENV === "preview" ||
        window.location.hostname === "localhost" ||
        window.location.hostname.includes("vercel.app"),
    )
  }, [])

  return isPreview
}
