"use client"

import { useAgents } from "@/hooks/use-agents"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Plus, Trash2, Edit } from "lucide-react"
import Link from "next/link"

export default function AgentList() {
  const { agents, isLoading, error, deleteAgent } = useAgents()

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
        <p>Une erreur est survenue: {error.message}</p>
      </div>
    )
  }

  if (agents.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun agent trouvé</h3>
        <p className="text-gray-500 mb-6">Vous n'avez pas encore créé d'agent.</p>
        <Link href="/agents/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Créer un agent
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Mes agents</h2>
        <Link href="/agents/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Créer un agent
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <Card key={agent.id} className="overflow-hidden">
            <CardHeader className="bg-gray-50">
              <CardTitle className="flex justify-between items-center">
                <span className="truncate">{agent.name}</span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    agent.status === "active"
                      ? "bg-green-100 text-green-800"
                      : agent.status === "draft"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {agent.status}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-gray-500">Créé le {new Date(agent.created_at).toLocaleDateString()}</p>
              <p className="text-sm text-gray-500">Mis à jour le {new Date(agent.updated_at).toLocaleDateString()}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link href={`/agents/${agent.id}`}>
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => {
                  if (confirm("Êtes-vous sûr de vouloir supprimer cet agent ?")) {
                    deleteAgent(agent.id)
                  }
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
