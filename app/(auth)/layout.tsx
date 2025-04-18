import type { ReactNode } from "react"
import { Toaster } from "@/components/ui/toaster"
import { ThemeToggle } from "@/components/theme-toggle"

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f4f9ff] flex flex-col transition-colors duration-300">
      {/* Header with logo */}
      <div className="p-6">
        <div className="w-12 h-12 bg-black dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black font-bold">
          L
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">{children}</div>

      {/* Theme toggle in bottom right */}
      <div className="fixed bottom-6 right-6">
        <ThemeToggle showLabel={false} />
      </div>

      <Toaster />
    </div>
  )
}
