import type React from "react"
import { supabase } from "@/lib/supabase-client"
import type { AgentData } from "@/contexts/agent-creation-context"

// Helper pour logger avec un préfixe
const log = (level: 'info' | 'error' | 'warn', message: string, ...args: any[]) => {
  console[level](`[AgentService] ${message}`, ...args);
};

class AgentService {
  async getAgents(): Promise<AgentData[]> {
    log('info', 'getAgents: Fetching all agents...');
    try {
      // Get agents from Supabase directly
      const { data, error } = await supabase.from("agent").select("*").order("created_at", { ascending: false })

      if (error) throw error

      log('info', `getAgents: Success - Found ${data?.length ?? 0} agents.`);
      return data || []
    } catch (error) {
      log('error', 'getAgents: Failed', error);
      throw error
    }
  }

  async getAgentById(id: string | number): Promise<any> {
    const agentIdStr = id.toString();
    log('info', `getAgentById: Fetching agent with id=${agentIdStr}...`);
    try {
      // Convert id to string if it's a number
      if (agentIdStr === "create") {
        log('info', 'getAgentById: Handling "create" slug, returning null data.');
        return { data: null, error: null }
      }

      // Get agent data from Supabase
      const { data, error } = await supabase.from("agent").select("*").eq("id", agentIdStr).single()

      if (error) throw error

      log('info', `getAgentById: Success - Found agent id=${agentIdStr}.`, data);
      return { data, error: null }
    } catch (error) {
      log('error', `getAgentById: Failed for id=${agentIdStr}`, error);
      return { data: null, error }
    }
  }

  async getVoiceProfiles(): Promise<{ id: number; voice_identifier: string; display_name: string }[]> {
    log('info', 'getVoiceProfiles: Fetching voice profiles...');
    try {
      const { data, error } = await supabase
        .from("voice_profiles")
        .select("id, voice_identifier, display_name")

      if (error) throw error
      log('info', `getVoiceProfiles: Success - Found ${data?.length ?? 0} profiles.`);
      return data || []
    } catch (error) {
      log('error', 'getVoiceProfiles: Failed', error);
      throw error
    }
  }

  async createAgent(agent: Partial<AgentData>): Promise<AgentData | null> {
    log('info', 'createAgent: Attempting to create agent... ', agent);
    try {
      // We need to get the user ID from Supabase auth
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")
      log('info', 'createAgent: User authenticated.');

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
      log('info', `createAgent: Found user record with id=${userData.id}.`);

      // Create agent record
      const agentToInsert: Record<string, any> = {
        name: agent.name || "Nouvel agent",
        status: agent.status || "draft",
        user_id: userData.id,
        sector: agent.sector,
        establishment: agent.establishment,
        website: agent.website,
        address: agent.address,
        city: agent.city,
        redirect_phone_number: agent.phoneNumber,
        deviceType: agent.deviceType,
        additionalInfo: agent.additionalInfo,
        openingHours: agent.openingHours,
        closureDays: agent.closureDays,
        options: agent.options,
        foodOptions: agent.foodOptions,
        integrations: agent.integrations,
        document_urls: agent.documents || [],
        voiceGender: agent.voiceGender,
        voiceType: agent.voiceType,
        voice_profile_id: agent.voice_profile_id,
        transferPhone: agent.transferPhone,
        configOptions: agent.configOptions,
      };
      // Retirer les clés undefined pour éviter des erreurs potentielles d'insertion
      Object.keys(agentToInsert).forEach(key => agentToInsert[key] === undefined && delete agentToInsert[key]);
      log('info', 'createAgent: Prepared data for insertion:', agentToInsert);

      const { data, error } = await supabase
        .from("agent")
        .insert(agentToInsert)
        .select()
        .single()

      if (error) throw error
      log('info', 'createAgent: Success - Agent created with id:', data?.id, data);
      return data
    } catch (error) {
      log('error', 'createAgent: Failed', error);
      return null
    }
  }

  async updateAgent(id: string | number, agentDataDB: Record<string, any>): Promise<Record<string, any> | null> {
    const agentIdStr = id.toString();
    log('info', `updateAgent: Attempting to update agent id=${agentIdStr}...`, agentDataDB);
    try {
      if (agentIdStr === "create") {
        log('warn', 'updateAgent: Called with "create" slug, aborting.');
        return null
      }

      // Retirer les clés undefined pour éviter des erreurs potentielles d'update
      const updatePayload = { ...agentDataDB };
      Object.keys(updatePayload).forEach(key => updatePayload[key] === undefined && delete updatePayload[key]);
      log('info', `updateAgent: Prepared payload for update id=${agentIdStr}:`, updatePayload);

      // Directement passer l'objet avec les noms de colonnes BDD
      log('info', `updateAgent: Executing Supabase update for id=${agentIdStr}...`);
      const { error: updateError } = await supabase
        .from("agent")
        .update(updatePayload) // Passer directement l'objet reçu et nettoyé
        .eq("id", agentIdStr)
      log('info', `updateAgent: Supabase update execution finished for id=${agentIdStr}.`);

      if (updateError) {
        log('error', `updateAgent: Supabase returned an error for id=${agentIdStr}.`, updateError);
        throw updateError
      }
      // Since we are not selecting, we can't return updatedData easily
      // Return a simple success indicator or the original payload for now
      log('info', `updateAgent: Success (update only) - Agent id=${agentIdStr} update request sent.`);
      return { success: true }; // Indicate success without returning full data
    } catch (error) {
      // Log spécifique à Supabase si possible
      if ((error as any).message) {
        log('error', `updateAgent: Failed Supabase update for id=${agentIdStr}:`, (error as any).message, error);
      } else {
        log('error', `updateAgent: Failed generic update for id=${agentIdStr}:`, error);
      }
      return null
    }
  }
}
export const agentService = new AgentService()

