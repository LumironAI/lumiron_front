"use client"

import { createContext, useContext, useCallback, type ReactNode } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"

// Types pour les données de l'agent
export interface AgentData {
  id?: string
  name?: string
  sector?: string
  status?: "active" | "inactive" | "draft"
  establishment?: string
  website?: string
  address?: string
  city?: string
  phoneNumber?: string
  deviceType?: string
  voiceGender?: string
  voiceType?: string
  transferPhone?: string
  configOptions?: {
    id: string
    label: string
    description?: string
    enabled: boolean
  }[]
  integrations?: {
    id: string
    name: string
    description: string
    enabled: boolean
    fields?: {
      id: string
      label: string
      value: string
    }[]
  }[]
  openingHours?: {
    [day: string]: {
      lunch: { open: boolean; start: string; end: string }
      dinner: { open: boolean; start: string; end: string }
    }
  }
  closureDays?: {
    enabled: boolean
    dates: Date[]
  }
  options?: {
    [key: string]: boolean
  }
  foodOptions?: {
    [key: string]: boolean
  }
  documents?: string[]
  additionalInfo?: string
}

// Valeurs par défaut
const defaultAgentData: AgentData = {
  name: "",
  sector: "restaurant",
  openingHours: {
    Lundi: {
      lunch: { open: false, start: "12:00", end: "14:30" },
      dinner: { open: false, start: "19:00", end: "22:30" },
    },
    Mardi: {
      lunch: { open: true, start: "12:00", end: "14:30" },
      dinner: { open: true, start: "19:00", end: "22:30" },
    },
    Mercredi: {
      lunch: { open: true, start: "12:00", end: "14:30" },
      dinner: { open: true, start: "19:00", end: "22:30" },
    },
    Jeudi: {
      lunch: { open: true, start: "12:00", end: "14:30" },
      dinner: { open: true, start: "19:00", end: "22:30" },
    },
    Vendredi: {
      lunch: { open: true, start: "12:00", end: "14:30" },
      dinner: { open: true, start: "19:00", end: "22:30" },
    },
    Samedi: {
      lunch: { open: true, start: "12:00", end: "14:30" },
      dinner: { open: true, start: "19:00", end: "22:30" },
    },
    Dimanche: {
      lunch: { open: true, start: "12:00", end: "14:30" },
      dinner: { open: true, start: "19:00", end: "22:30" },
    },
  },
  closureDays: {
    enabled: false,
    dates: [],
  },
  options: {
    "Accès PMR": false,
    "Chaise haute": false,
    "Enfant accepté": false,
    "Animaux acceptés": false,
    Parking: false,
    "Salle extérieure": false,
    Terrasse: false,
  },
  foodOptions: {
    Végétarien: false,
    Vegan: false,
    "Sans gluten": false,
    Halal: false,
    Casher: false,
  },
  phoneNumber: "",
  deviceType: "apple",
  voiceGender: "homme",
  voiceType: "enthousiaste",
  transferPhone: "",
  documents: [],
  additionalInfo: "",
}

// Type pour le contexte
interface AgentCreationContextType {
  agentData: AgentData
  updateAgentData: (data: Partial<AgentData>) => void
  resetAgentData: () => void
  setAgentId: (id: string) => void
}

// Création du contexte
const AgentCreationContext = createContext<AgentCreationContextType | undefined>(undefined)

// Hook pour utiliser le contexte
export function useAgentCreation() {
  const context = useContext(AgentCreationContext)
  if (context === undefined) {
    throw new Error("useAgentCreation must be used within an AgentCreationProvider")
  }
  return context
}

// Provider du contexte
export function AgentCreationProvider({ children }: { children: ReactNode }) {
  const [agentData, setAgentData] = useLocalStorage<AgentData>("agent-creation-data", defaultAgentData)

  // Utiliser useCallback pour éviter de recréer cette fonction à chaque rendu
  const updateAgentData = useCallback(
    (data: Partial<AgentData>) => {
      setAgentData((prev) => {
        // Vérifier si les données ont réellement changé
        const updated = { ...prev, ...data }
        if (JSON.stringify(updated) === JSON.stringify(prev)) {
          return prev // Retourner l'état précédent si rien n'a changé
        }
        return updated
      })
    },
    [setAgentData],
  )

  const resetAgentData = useCallback(() => {
    setAgentData(defaultAgentData)
  }, [setAgentData])

  // Nouvelle fonction pour définir l'ID de l'agent
  const setAgentId = useCallback(
    (id: string) => {
      setAgentData((prev) => ({
        ...prev,
        id,
      }))
    },
    [setAgentData],
  )

  return (
    <AgentCreationContext.Provider value={{ agentData, updateAgentData, resetAgentData, setAgentId }}>
      {children}
    </AgentCreationContext.Provider>
  )
}
