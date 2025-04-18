"use client"

import { useEffect } from "react"
import { useTheme } from "@/components/theme-provider"

export function useSystemTheme() {
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    // Only listen for system preference changes if the theme is set to "system"
    if (theme !== "system") return

    // Create a media query to detect system preference
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    // Function to handle system preference changes
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme("system")
    }

    // Add event listener
    mediaQuery.addEventListener("change", handleChange)

    // Clean up
    return () => {
      mediaQuery.removeEventListener("change", handleChange)
    }
  }, [theme, setTheme])
}
