"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Globe,
  LayoutDashboard,
  PhoneCall,
  Users,
  History,
  PhoneOutgoing,
  FileSpreadsheet,
  UserSquare,
  ChevronDown,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"

export function Sidebar() {
  const pathname = usePathname()
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const { user, isAuthenticated } = useAuth()

  // Add effect for debugging
  useEffect(() => {
    console.log("Sidebar mounted with auth state:", { isAuthenticated, pathname, hasUser: !!user })
  }, [isAuthenticated, pathname, user])

  console.log("Sidebar rendering:", { isAuthenticated, pathname })

  // Don't render the sidebar if the user is not authenticated
  // or if the current path is an auth path
  if (
    !isAuthenticated ||
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/register") ||
    pathname?.startsWith("/forgot-password") ||
    pathname?.startsWith("/reset-password")
  ) {
    console.log("Sidebar not rendering due to condition:", { isAuthenticated, pathname })
    return null
  }

  return (
    <div className="w-60 h-screen bg-card border-r flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-bold">L</div>
          <span className="text-xl font-bold">Lumiron</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-auto px-3">
        {/* Tableau de bord */}
        <Link
          href="/dashboard"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
            pathname === "/dashboard"
              ? "bg-accent text-accent-foreground"
              : "text-foreground hover:bg-secondary hover:text-foreground dark:hover:text-white",
          )}
        >
          <LayoutDashboard size={18} className="min-w-5 h-5" />
          <span>Tableau de bord</span>
        </Link>

        <div className="h-px bg-gray-200 my-3 mx-1" />

        {/* ASSISTANTS VOCAUX */}
        <div className="px-3 py-2">
          <h3 className="text-xs font-semibold text-gray-500 tracking-wider mb-2">ASSISTANTS VOCAUX</h3>

          {/* Appels entrants */}
          <Link
            href="/dashboard/appels-entrants"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors mb-1",
              pathname === "/dashboard/appels-entrants"
                ? "bg-accent text-accent-foreground"
                : "text-foreground hover:bg-secondary hover:text-foreground dark:hover:text-white",
            )}
          >
            <PhoneCall size={18} className="min-w-5 h-5" />
            <span>Appels entrants</span>
          </Link>

          {/* Sous-éléments d'Appels entrants */}
          <div className="pl-4">
            {/* Agents (sous Appels entrants) */}
            <Link
              href="/dashboard/agents"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors mb-1",
                pathname === "/dashboard/agents"
                  ? "bg-blue-100 text-accent-foreground"
                  : "text-foreground hover:bg-secondary hover:text-foreground dark:hover:text-white",
              )}
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <Users size={18} />
              </div>
              <span>Agents</span>
            </Link>

            {/* Historique (sous Appels entrants) */}
            <Link
              href="/dashboard/historique-entrants"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors mb-3",
                pathname === "/dashboard/historique-entrants"
                  ? "bg-accent text-accent-foreground"
                  : "text-foreground hover:bg-secondary hover:text-foreground dark:hover:text-white",
              )}
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <History size={18} />
              </div>
              <span>Historique</span>
            </Link>
          </div>

          {/* Appels sortants */}
          <Link
            href="/dashboard/appels-sortants"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors mb-1",
              pathname?.startsWith("/dashboard/appels-sortants")
                ? "bg-accent text-accent-foreground"
                : "text-foreground hover:bg-secondary hover:text-foreground dark:hover:text-white",
            )}
          >
            <PhoneOutgoing size={18} className="min-w-5 h-5" />
            <span>Appels sortants</span>
          </Link>

          {/* Sous-éléments d'Appels sortants */}
          <div className="pl-4">
            {/* Agents (sous Appels sortants) */}
            <Link
              href="/dashboard/agents-sortants"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors mb-1",
                pathname === "/dashboard/agents-sortants"
                  ? "bg-accent text-accent-foreground"
                  : "text-foreground hover:bg-secondary hover:text-foreground dark:hover:text-white",
              )}
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <Users size={18} />
              </div>
              <span>Agents</span>
            </Link>

            {/* Campagnes */}
            <Link
              href="/dashboard/campagnes"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors mb-1",
                pathname === "/dashboard/campagnes"
                  ? "bg-accent text-accent-foreground"
                  : "text-foreground hover:bg-secondary hover:text-foreground dark:hover:text-white",
              )}
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <FileSpreadsheet size={18} />
              </div>
              <span>Campagnes</span>
            </Link>

            {/* Leads */}
            <Link
              href="/dashboard/leads"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors mb-1",
                pathname === "/dashboard/leads"
                  ? "bg-accent text-accent-foreground"
                  : "text-foreground hover:bg-secondary hover:text-foreground dark:hover:text-white",
              )}
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <UserSquare size={18} />
              </div>
              <span>Leads</span>
            </Link>

            {/* Historique (sous Appels sortants) */}
            <Link
              href="/dashboard/historique-sortants"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors mb-1",
                pathname === "/dashboard/historique-sortants"
                  ? "bg-accent text-accent-foreground"
                  : "text-foreground hover:bg-secondary hover:text-foreground dark:hover:text-white",
              )}
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <History size={18} />
              </div>
              <span>Historique</span>
            </Link>
          </div>
        </div>

        <div className="h-px bg-gray-200 my-3 mx-1" />

        {/* CHATBOTS */}
        <div className="px-3 py-2">
          <h3 className="text-xs font-semibold text-gray-500 tracking-wider">CHATBOTS</h3>
          {/* Contenu pour les chatbots à ajouter ultérieurement */}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t">
        <div className="mb-3">
          <ThemeToggle />
        </div>

        <button
          className="flex items-center gap-2 w-full text-left py-2"
          onClick={() => setIsLanguageOpen(!isLanguageOpen)}
        >
          <Globe size={18} />
          <span className="text-sm flex-1">Français</span>
          <ChevronDown size={16} className={cn("transition-transform", isLanguageOpen && "rotate-180")} />
        </button>

        {isLanguageOpen && (
          <div className="mt-1 pl-7 space-y-1">
            <button className="w-full text-left py-1 text-sm hover:text-primary">Français</button>
            <button className="w-full text-left py-1 text-sm hover:text-primary">English</button>
          </div>
        )}
      </div>
    </div>
  )
}
