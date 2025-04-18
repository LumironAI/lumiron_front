"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase-client"
import { useToast } from "@/hooks/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"

export interface Agent {
  id: number
  name: string
  status: string
  user_id: number
  voice_profile_id?: number | null
  created_at?: string
  updated_at?: string
}

export interface AgentTool {
  id: string
  agent_id: number
  tool_id: string
  is_enabled: boolean
  created_at?: string
  updated_at?: string
}

export function useAgents() {
  const [agents, setAgents] = useState<Agent[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    async function fetchAgents() {
      if (!user) return

      try {
        setIsLoading(true)

        const { data, error } = await supabase.from("agent").select("*").order("created_at", { ascending: false })

        if (error) throw error

        setAgents(data)
      } catch (err) {
        console.error("Error fetching agents:", err)
        setError(err instanceof Error ? err : new Error(String(err)))
        toast({
          title: "Erreur",
          description: "Impossible de charger les agents",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAgents()

    // Configurer un abonnement en temps réel pour les mises à jour des agents
    const channel = supabase
      .channel("public:agent")
      .on("postgres_changes", { event: "*", schema: "public", table: "agent" }, () => {
        fetchAgents()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [toast, user])

  async function createAgent(agentData: Omit<Agent, "id" | "created_at" | "updated_at" | "user_id">) {
    try {
      setIsLoading(true)

      // 1. Valider les données
      if (!agentData.name || agentData.name.trim() === "") {
        throw new Error("Le nom de l'agent est requis")
      }

      // 2. Récupérer l'ID utilisateur en utilisant auth_id
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("auth_id", user?.id)
        .single()

      if (userError) {
        console.error("Error fetching user:", userError)
        throw new Error("Impossible de récupérer les informations utilisateur")
      }

      if (!userData) {
        throw new Error("Utilisateur non trouvé")
      }

      // 3. Créer l'agent
      const { data, error } = await supabase
        .from("agent")
        .insert({
          ...agentData,
          user_id: userData.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error

      // 4. Ajouter des outils par défaut pour l'agent
      if (data) {
        await addDefaultTools(data.id)
      }

      // 5. Mettre à jour la liste des agents
      setAgents((prev) => (prev ? [data, ...prev] : [data]))

      toast({
        title: "Agent créé",
        description: "L'agent a été créé avec succès",
      })

      return data
    } catch (err) {
      console.error("Error creating agent:", err)
      setError(err instanceof Error ? err : new Error(String(err)))
      toast({
        title: "Erreur",
        description: err instanceof Error ? err.message : "Impossible de créer l'agent",
        variant: "destructive",
      })
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  async function addDefaultTools(agentId: number) {
    try {
      // Liste des outils par défaut à ajouter
      const defaultTools = [
        { id: `${agentId}_welcome`, agent_id: agentId, tool_id: "welcome", is_enabled: true },
        { id: `${agentId}_faq`, agent_id: agentId, tool_id: "faq", is_enabled: true },
      ]

      const { error } = await supabase.from("agent_tools").insert(defaultTools)

      if (error) throw error
    } catch (err) {
      console.error("Error adding default tools:", err)
      // Ne pas faire échouer la création de l'agent si l'ajout d'outils échoue
    }
  }

  async function updateAgent(id: number, agentData: Partial<Agent>) {
    try {
      setIsLoading(true)

      const { data, error } = await supabase
        .from("agent")
        .update({
          ...agentData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error

      setAgents((prev) => (prev ? prev.map((agent) => (agent.id === id ? data : agent)) : null))

      toast({
        title: "Agent mis à jour",
        description: "L'agent a été mis à jour avec succès",
      })

      return data
    } catch (err) {
      console.error("Error updating agent:", err)
      setError(err instanceof Error ? err : new Error(String(err)))
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'agent",
        variant: "destructive",
      })
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  async function deleteAgent(id: number) {
    try {
      setIsLoading(true)

      // 1. Supprimer les outils associés à l'agent
      const { error: toolsError } = await supabase.from("agent_tools").delete().eq("agent_id", id)

      if (toolsError) throw toolsError

      // 2. Supprimer l'agent
      const { error } = await supabase.from("agent").delete().eq("id", id)

      if (error) throw error

      setAgents((prev) => (prev ? prev.filter((agent) => agent.id !== id) : null))

      toast({
        title: "Agent supprimé",
        description: "L'agent a été supprimé avec succès",
      })
    } catch (err) {
      console.error("Error deleting agent:", err)
      setError(err instanceof Error ? err : new Error(String(err)))
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'agent",
        variant: "destructive",
      })
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    agents,
    isLoading,
    error,
    createAgent,
    updateAgent,
    deleteAgent,
  }
}
