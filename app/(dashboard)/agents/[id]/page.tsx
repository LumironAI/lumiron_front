"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { PageHeader } from "@/components/header/page-header"
import { UserNav } from "@/components/header/user-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import Link from "next/link"
import { useAgents } from "@/hooks/use-agents"
import { useToast } from "@/hooks/ui/use-toast"
import { agentService } from "@/services/agent.service"

export default function AgentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { agents, updateAgent, createAgent, isLoading: agentsLoading } = useAgents()
  const { toast } = useToast()

  const [name, setName] = useState("")
  const [status, setStatus] = useState("draft")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateMode, setIsCreateMode] = useState(false)

  // Determine if we're in create mode or edit mode
  useEffect(() => {
    if (params.id === "create") {
      setIsCreateMode(true)
      setIsLoading(false)
      return
    }

    // If we're not in create mode, load the agent data
    const fetchAgent = async () => {
      try {
        setIsLoading(true)

        // Handle the case where id might be "create" or a number
        const agentId = params.id as string

        const { data, error } = await agentService.getAgentById(agentId)

        if (error) throw error

        if (data) {
          setName(data.name || "")
          setStatus(data.status || "draft")
        } else {
          toast({
            title: "Erreur",
            description: "Agent non trouvé",
            variant: "destructive",
          })
          router.push("/agents")
        }
      } catch (error) {
        console.error("Error fetching agent:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les données de l'agent",
          variant: "destructive",
        })
        router.push("/agents")
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id && params.id !== "create") {
      fetchAgent()
    }
  }, [params.id, router, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (isCreateMode) {
        // Create a new agent
        const initialData = {
          name,
          status,
        }

        // Create a temporary agent and get its ID
        const agent = await agentService.createAgent(initialData)

        toast({
          title: "Agent créé",
          description: "L'agent a été créé avec succès",
        })

        // Navigate to the first step of agent creation with the new ID
        if (agent && agent.id) {
          router.push(`/agents/${agent.id}/create`)
        } else {
          throw new Error("Failed to create agent")
        }
      } else {
        // Update an existing agent
        const agentId = params.id as string
        await updateAgent(agentId, { name, status })
        toast({
          title: "Agent mis à jour",
          description: "L'agent a été mis à jour avec succès",
        })
        router.push("/agents")
      }
    } catch (error) {
      console.error("Error saving agent:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde de l'agent",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading || agentsLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <PageHeader title={isCreateMode ? "Créer un agent" : "Modifier l'agent"} />
          <UserNav />
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <PageHeader title={isCreateMode ? "Créer un agent" : "Modifier l'agent"} />
        <UserNav />
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informations de l'agent</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de l'agent</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Entrez le nom de l'agent"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="draft">Brouillon</option>
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
              </select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/agents">
              <Button type="button" variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting} className="bg-[#2c90f6] hover:bg-[#2c90f6]/90 text-white">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isCreateMode ? "Création..." : "Enregistrement..."}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isCreateMode ? "Créer" : "Enregistrer"}
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
