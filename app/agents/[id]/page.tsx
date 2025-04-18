"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase-client"
import AgentForm from "@/components/agents/agent-form"
import { Loader2 } from "lucide-react"
import type { Agent } from "@/hooks/use-agents"

export default function EditAgentPage() {
  const params = useParams()
  const [agent, setAgent] = useState<Agent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        setIsLoading(true)
        const { data, error } = await supabase.from("agent").select("*").eq("id", params.id).single()

        if (error) throw error

        setAgent(data)
      } catch (err) {
        console.error("Error fetching agent:", err)
        setError("Une erreur est survenue lors du chargement de l'agent.")
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchAgent()
    }
  }, [params.id])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
        <p>Agent non trouvé.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <AgentForm agent={agent} isEdit />
    </div>
  )
}
