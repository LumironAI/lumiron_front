"use client"

import { cn } from "@/lib/utils"

interface AuthTab {
  id: string
  label: string
}

interface AuthTabsProps {
  tabs: AuthTab[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

export function AuthTabs({ tabs, activeTab, onTabChange }: AuthTabsProps) {
  return (
    <div className="flex border-b border-gray-200 dark:border-gray-700 w-full">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={cn(
            "px-6 py-3 text-sm font-medium relative flex-1 transition-colors",
            activeTab === tab.id
              ? "text-[#2c90f6] border-b-2 border-[#2c90f6]"
              : "text-muted-foreground hover:text-foreground",
          )}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
