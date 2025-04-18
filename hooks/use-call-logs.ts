"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase-client"
import { useToast } from "@/hooks/ui/use-toast"

export interface CallLog {
  id: number
  agent_id: number
  call_sid: string
  status: string
  duration: string
  external_number: string
  phone_number_id: number
  evaluation_score: number | null
  evaluation_comment: string | null
  evaluation_reasons: string | null
  audio_url: string | null
  created_at: string
  updated_at: string
}

export function useCallLogs(agentId?: number) {
  const [callLogs, setCallLogs] = useState<CallLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchCallLogs() {
      try {
        setIsLoading(true)

        let query = supabase.from("call_log").select("*").order("created_at", { ascending: false })

        if (agentId) {
          query = query.eq("agent_id", agentId)
        }

        const { data, error } = await query

        if (error) throw error

        setCallLogs(data || [])
      } catch (err) {
        console.error("Error fetching call logs:", err)
        setError(err instanceof Error ? err : new Error(String(err)))
        toast({
          title: "Erreur",
          description: "Impossible de charger les journaux d'appels",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCallLogs()

    // Set up real-time subscription for call logs
    const channel = supabase
      .channel("public:call_log")
      .on("postgres_changes", { event: "*", schema: "public", table: "call_log" }, () => {
        fetchCallLogs()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [agentId, toast])

  return {
    callLogs,
    isLoading,
    error,
  }
}
