"use client"

import { useCallback, useState } from "react"
import type { AgentData } from "@/contexts/agent-creation-context"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/ui/use-toast"

export function useAgentService() {
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  // Helper function for API calls
  const apiCall = useCallback(\
  async <T>(url: string, method: string, body?: any): Promise<T | null> => {
    setIsLoading(true)

  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "/api"
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    // Add authorization header if user is logged in
    if (user?.token) {
      headers["Authorization"] = `Bearer ${user.token}`
    }

    const response = await fetch(`${baseUrl}${url}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      })

    if (!response.ok) {
      toast({
        title: "Erreur",
        description: `Une erreur est survenue (${response.status})`,
        variant: "destructive",
      })
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error: any) {
    console.error(`API error for ${url}:`, error)

    toast({
      title: "Erreur de connexion",
      description: "Impossible de se connecter au serveur",
      variant: "destructive",
    })
    throw error
  } finally {
    setIsLoading(false)
  }
}
,
  [user, toast]
)

const getAgents = useCallback(async () => {
  try {
    const data = await apiCall<AgentData[]>("/agents", "GET")
    return data || []
  } catch (error: any) {
    console.error("Error fetching agents:", error)
    return []
  }
}, [apiCall])

const getAgentById = useCallback(
  async (id: string) => {
    try {
      const data = await apiCall<AgentData>(`/agents/${id}`, "GET")
      return data
    } catch (error: any) {
      console.error(`Error fetching agent ${id}:`, error)
      throw error
    }
  },
  [apiCall],
)

const createAgent = useCallback(
  async (agent: Partial<AgentData>) => {
    try {
      const data = await apiCall<AgentData>("/agents", "POST", agent)
      return data
    } catch (error: any) {
      console.error("Error creating agent:", error)
      throw error
    }
  },
  [apiCall],
)

const updateAgent = useCallback(
  async (id: string, agent: Partial<AgentData>) => {
    try {
      const data = await apiCall<AgentData>(`/agents/${id}`, "PUT", agent)
      return data
    } catch (error: any) {
      console.error(`Error updating agent ${id}:`, error)
      throw error
    }
  },
  [apiCall],
)

const deleteAgent = useCallback(
  async (id: string) => {
    try {
      await apiCall<void>(`/agents/${id}`, "DELETE")
      return true
    } catch (error: any) {
      console.error(`Error deleting agent ${id}:`, error)
      throw error
    }
  },
  [apiCall],
)

const saveAgentDraft = useCallback(
  async (agent: Partial<AgentData>) => {
    try {
      const data = await apiCall<AgentData>("/agents/drafts", "POST", agent)
      return data
    } catch (error: any) {
      console.error("Error saving agent draft:", error)
      throw error
    }
  },
  [apiCall],
)

return {
    getAgents,
    getAgentById,
    createAgent,
    updateAgent,
    deleteAgent,
    saveAgentDraft,
    isLoading,
  }
}
