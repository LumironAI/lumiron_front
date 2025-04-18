"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase-client"
import type { Database } from "@/types/supabase"

export type AgentTool = Database["public"]["Tables"]["agent_tools"]["Row"]
export type AgentToolInsert = Database["public"]["Tables"]["agent_tools"]["Insert"]
export type AgentToolUpdate = Database["public"]["Tables"]["agent_tools"]["Update"]

export function useAgentTools(agentId: number) {
  const [tools, setTools] = useState<AgentTool[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchTools = async () => {
      if (!agentId) return

      try {
        setIsLoading(true)
        setError(null)

        // Grâce aux politiques RLS, cette requête ne retournera que les outils des agents de l'utilisateur connecté
        const { data, error } = await supabase.from("agent_tools").select("*").eq("agent_id", agentId)

        if (error) throw error

        setTools(data || [])
      } catch (err) {
        console.error("Error fetching agent tools:", err)
        setError(err instanceof Error ? err : new Error("Failed to fetch agent tools"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchTools()

    // Configurer un abonnement en temps réel pour les mises à jour des outils
    const channel = supabase
      .channel(`public:agent_tools:agent_id=eq.${agentId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "agent_tools", filter: `agent_id=eq.${agentId}` },
        (payload) => {
          // Rafraîchir les outils lorsqu'il y a des changements
          fetchTools()
        },
      )
      .subscribe()

    return () => {
      // Nettoyer l'abonnement
      supabase.removeChannel(channel)
    }
  }, [agentId])

  const addTool = async (toolData: Omit<AgentToolInsert, "agent_id">) => {
    try {
      const { data, error } = await supabase
        .from("agent_tools")
        .insert({
          ...toolData,
          agent_id: agentId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()

      if (error) throw error

      // Mettre à jour la liste des outils
      setTools((prev) => [...prev, ...(data || [])])
      return data?.[0]
    } catch (err) {
      console.error("Error adding agent tool:", err)
      throw err
    }
  }

  const updateTool = async (id: string, toolData: AgentToolUpdate) => {
    try {
      const { data, error } = await supabase
        .from("agent_tools")
        .update({
          ...toolData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()

      if (error) throw error

      // Mettre à jour la liste des outils
      setTools((prev) => prev.map((tool) => (tool.id === id ? { ...tool, ...data?.[0] } : tool)))
      return data?.[0]
    } catch (err) {
      console.error("Error updating agent tool:", err)
      throw err
    }
  }

  const removeTool = async (id: string) => {
    try {
      const { error } = await supabase.from("agent_tools").delete().eq("id", id)

      if (error) throw error

      // Mettre à jour la liste des outils
      setTools((prev) => prev.filter((tool) => tool.id !== id))
    } catch (err) {
      console.error("Error removing agent tool:", err)
      throw err
    }
  }

  return {
    tools,
    isLoading,
    error,
    addTool,
    updateTool,
    removeTool,
  }
}
