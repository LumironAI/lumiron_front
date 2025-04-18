"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Switch } from "@/components/ui/switch"

interface ThemeToggleProps {
  showLabel?: boolean
}

export function ThemeToggle({ showLabel = true }: ThemeToggleProps) {
  const { isDarkMode, setTheme } = useTheme()

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {isDarkMode ? <Moon size={18} className="text-primary" /> : <Sun size={18} className="text-amber-500" />}
        {showLabel && <span className="text-sm">Mode sombre</span>}
      </div>
      <Switch
        checked={isDarkMode}
        onCheckedChange={() => setTheme(isDarkMode ? "light" : "dark")}
        aria-label="Toggle dark mode"
        className={isDarkMode ? "bg-primary" : ""}
      />
    </div>
  )
}
