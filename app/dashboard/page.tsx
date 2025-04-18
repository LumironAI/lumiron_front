"use client"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/header/page-header"
import { UserNav } from "@/components/header/user-nav"
import { useAgents } from "@/hooks/use-agents"
import { useCallLogs } from "@/hooks/use-call-logs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, Phone, PhoneOff, Loader2 } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { useState } from "react"
import { agentService } from "@/services"
import { useToast } from "@/hooks/ui/use-toast"

export default function DashboardPage() {
  const router = useRouter()
  const { agents, isLoading: agentsLoading } = useAgents()
  const { callLogs, isLoading: callsLoading } = useCallLogs()
  const [isCreating, setIsCreating] = useState(false)
  const { toast } = useToast()

  const activeAgents = agents?.filter((agent) => agent.status === "active") || []
  const draftAgents = agents?.filter((agent) => agent.status === "draft") || []

  const completedCalls = callLogs?.filter((call) => call.status === "completed") || []
  const missedCalls = callLogs?.filter((call) => call.status === "missed") || []

  const isLoading = agentsLoading || callsLoading

  const handleCreateAgent = async () => {
    try {
      setIsCreating(true)

      // Create a temporary agent in the database first
      const initialData = {
        name: "Nouvel agent",
        status: "draft" as "active" | "inactive" | "draft",
      }

      // Create a temporary agent and get its ID
      const agent = await agentService.createAgent(initialData)
      
      if (agent) {
        // Navigate to the first step of agent creation with the real ID
        router.push(`/dashboard/agents/${agent.id}/create`)
      } else {
        throw new Error("Failed to create agent")
      }
    } catch (error) {
      console.error("Error creating agent:", error)
      toast({
        title: "Erreur",
        description: "Impossible de créer un nouvel agent",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <PageHeader title="Tableau de bord" />
        <UserNav />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Vue d'ensemble</h2>
            <Button 
              onClick={handleCreateAgent}
              disabled={isCreating}
              className="bg-[#2c90f6] hover:bg-[#2c90f6]/90 text-white"
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Créer un agent
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Agents actifs</CardTitle>
                <CardDescription>Nombre d'agents en production</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{activeAgents.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Agents en brouillon</CardTitle>
                <CardDescription>Agents en cours de configuration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{draftAgents.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Total des appels</CardTitle>
                <CardDescription>Nombre d'appels traités</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{callLogs?.length || 0}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Appels récents</CardTitle>
              <CardDescription>Les 5 derniers appels traités par vos agents</CardDescription>
            </CardHeader>
            <CardContent>
              {callLogs && callLogs.length > 0 ? (
                <div className="space-y-4">
                  {callLogs.slice(0, 5).map((call) => (
                    <div key={call.id} className="flex justify-between items-center border-b pb-4 last:border-0">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {call.status === "completed" ? (
                            <Phone className="h-5 w-5 text-green-500" />
                          ) : (
                            <PhoneOff className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{call.external_number}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(call.created_at), { addSuffix: true, locale: fr })}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {call.status === "completed" && (
                          <div className="text-sm text-muted-foreground">Durée: {call.duration}</div>
                        )}
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            call.status === "completed" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {call.status === "completed" ? "Complété" : "Manqué"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">Aucun appel récent à afficher</div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
