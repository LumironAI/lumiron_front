import { getAuthenticatedClient } from "@/lib/supabase-client"

export interface CallLogFilters {
  agentId?: number
  status?: string
  startDate?: string
  endDate?: string
  phoneNumber?: string
  page?: number
  pageSize?: number
}

export interface CallLog {
  id: number
  agentId: number | null
  phoneNumberId: number | null
  externalNumber: string | null
  status: string | null
  duration: string | null
  callSid: string | null
  evaluationScore: number | null
  evaluationReasons: string | null
  evaluationComment: string | null
  audioUrl: string | null
  createdAt: string | null
  updatedAt: string | null
  agentName?: string | null
}

class CallHistoryService {
  async getCallLogs(filters: CallLogFilters = {}): Promise<{ data: CallLog[]; count: number }> {
    try {
      const client = await getAuthenticatedClient()

      // Start building the query
      let query = client.from("call_log").select(
        `
          *,
          agent:agent_id(name)
        `,
        { count: "exact" },
      )

      // Apply filters
      if (filters.agentId) {
        query = query.eq("agent_id", filters.agentId)
      }

      if (filters.status) {
        query = query.eq("status", filters.status)
      }

      if (filters.phoneNumber) {
        query = query.ilike("external_number", `%${filters.phoneNumber}%`)
      }

      if (filters.startDate) {
        query = query.gte("created_at", filters.startDate)
      }

      if (filters.endDate) {
        query = query.lte("created_at", filters.endDate)
      }

      // Apply pagination
      const page = filters.page || 1
      const pageSize = filters.pageSize || 10
      const start = (page - 1) * pageSize

      query = query.range(start, start + pageSize - 1).order("created_at", { ascending: false })

      // Execute the query
      const { data, error, count } = await query

      if (error) throw error

      // Transform the data
      const transformedData = data.map((item) => ({
        id: item.id,
        agentId: item.agent_id,
        phoneNumberId: item.phone_number_id,
        externalNumber: item.external_number,
        status: item.status,
        duration: item.duration,
        callSid: item.call_sid,
        evaluationScore: item.evaluation_score,
        evaluationReasons: item.evaluation_reasons,
        evaluationComment: item.evaluation_comment,
        audioUrl: item.audio_url,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        agentName: item.agent?.name,
      }))

      return {
        data: transformedData,
        count: count || 0,
      }
    } catch (error) {
      console.error("Error fetching call logs:", error)
      return { data: [], count: 0 }
    }
  }

  async getCallLogById(id: number): Promise<CallLog | null> {
    try {
      const client = await getAuthenticatedClient()
      const { data, error } = await client
        .from("call_log")
        .select(`
          *,
          agent:agent_id(name)
        `)
        .eq("id", id)
        .single()

      if (error) throw error

      if (!data) return null

      return {
        id: data.id,
        agentId: data.agent_id,
        phoneNumberId: data.phone_number_id,
        externalNumber: data.external_number,
        status: data.status,
        duration: data.duration,
        callSid: data.call_sid,
        evaluationScore: data.evaluation_score,
        evaluationReasons: data.evaluation_reasons,
        evaluationComment: data.evaluation_comment,
        audioUrl: data.audio_url,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        agentName: data.agent?.name,
      }
    } catch (error) {
      console.error(`Error fetching call log ${id}:`, error)
      return null
    }
  }

  async updateCallEvaluation(
    id: number,
    evaluation: {
      score: number
      reasons?: string
      comment?: string
    },
  ): Promise<boolean> {
    try {
      const client = await getAuthenticatedClient()
      const { error } = await client
        .from("call_log")
        .update({
          evaluation_score: evaluation.score,
          evaluation_reasons: evaluation.reasons,
          evaluation_comment: evaluation.comment,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)

      if (error) throw error

      return true
    } catch (error) {
      console.error(`Error updating call evaluation for ${id}:`, error)
      return false
    }
  }
}

export const callHistoryService = new CallHistoryService()
