"use client"

import type * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { meetsContrastRequirements } from "@/utils/accessibility"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  isDarkMode: boolean
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  isDarkMode: false,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "lumiron-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemTheme)
      setIsDarkMode(systemTheme === "dark")
      return
    }

    root.classList.add(theme)
    setIsDarkMode(theme === "dark")
  }, [theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
    isDarkMode,
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem(storageKey) as Theme | null
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [storageKey])

  // This will check contrast ratios in development mode
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      // Wait for the DOM to update with the new theme
      const checkContrast = setTimeout(() => {
        // Get the computed styles
        const styles = getComputedStyle(document.documentElement)
        const bgColor = styles.getPropertyValue("--background").trim()
        const fgColor = styles.getPropertyValue("--foreground").trim()
        const primaryColor = styles.getPropertyValue("--primary").trim()
        const secondaryColor = styles.getPropertyValue("--secondary").trim()

        // Convert HSL to hex for contrast checking (simplified)
        const toHex = (color: string) => {
          // This is a placeholder - in a real app you'd convert HSL to hex
          // For now, we'll use placeholder values for demonstration
          if (color.includes("--background")) return theme === "dark" ? "#181d27" : "#f4f9ff"
          if (color.includes("--foreground")) return theme === "dark" ? "#f0f8ff" : "#181d27"
          if (color.includes("--primary")) return theme === "dark" ? "#4da3f8" : "#2c90f6"
          if (color.includes("--secondary")) return theme === "dark" ? "#293347" : "#daebff"
          return "#ffffff"
        }

        // Check some key contrast ratios
        const textContrast = meetsContrastRequirements(toHex(fgColor), toHex(bgColor))

        const primaryContrast = meetsContrastRequirements(toHex(primaryColor), toHex(bgColor))

        // Log warnings for any contrast issues
        if (!textContrast) {
          console.warn("Text contrast does not meet WCAG AA guidelines")
        }

        if (!primaryContrast) {
          console.warn("Primary color contrast does not meet WCAG AA guidelines")
        }
      }, 500)

      return () => clearTimeout(checkContrast)
    }
  }, [theme])

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
