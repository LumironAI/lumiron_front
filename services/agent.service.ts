import type React from "react"
import { supabase } from "@/lib/supabase-client"
import type { AgentData } from "@/contexts/agent-creation-context"

class AgentService {
  async getAgents(): Promise<AgentData[]> {
    try {
      // Get agents from Supabase directly
      const { data, error } = await supabase.from("agent").select("*").order("created_at", { ascending: false })

      if (error) throw error

      return data || []
    } catch (error) {
      console.error("Error fetching agents:", error)
      throw error
    }
  }

  async getAgentById(id: string | number): Promise<any> {
    try {
      // Convert id to string if it's a number
      const agentId = id.toString()

      // Special case for "create" slug
      if (agentId === "create") {
        return { data: null, error: null }
      }

      // Get agent data from Supabase
      const { data, error } = await supabase.from("agent").select("*").eq("id", agentId).single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error(`Error fetching agent ${id}:`, error)
      return { data: null, error }
    }
  }

  async createAgent(agent: Partial<AgentData>): Promise<AgentData | null> {
    try {
      // We need to get the user ID from Supabase auth
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      // Get user record from users table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("auth_id", user.id)
        .single()

      if (userError) throw userError
      if (!userData) {
        throw new Error("User not found")
      }

      // Create agent record
      const { data, error } = await supabase
        .from("agent")
        .insert({
          name: agent.name || "Nouvel agent",
          status: agent.status || "draft",
          user_id: userData.id,
        })
        .select()
        .single()

      if (error) throw error

      return data
    } catch (error) {
      console.error("Error creating agent:", error)
      return null
    }
  }

  async updateAgent(id: string | number, agent: Partial<AgentData>): Promise<AgentData | null> {
    try {
      // Convert id to string if it's a number
      const agentId = id.toString()

      // Special case for "create" slug
      if (agentId === "create") {
        return null
      }

      // Get agent data from Supabase
      const { data, error } = await supabase.from("agent").select("*").eq("id", agentId).single()

      if (error) throw error

      // Update agent data
      const updatedAgent = {
        ...data,
        ...agent,
      }

      // Save updated agent to Supabase
      const { data: updatedData, error: updateError } = await supabase
        .from("agent")
        .update(updatedAgent)
        .eq("id", agentId)
        .select()
        .single()

      if (updateError) throw updateError

      return updatedData
    } catch (error) {
      console.error(`Error updating agent ${id}:`, error)
      return null
    }
  }
}
export const agentService = new AgentService()

