"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { useAgents } from "@/hooks/use-agents"

interface AgentCardProps {
  agent: {
    id: number
    name: string
    status: string
    created_at: string
    updated_at: string
  }
}

export function AgentCard({ agent }: AgentCardProps) {
  const { deleteAgent } = useAgents()

  const handleDelete = async () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet agent ?")) {
      await deleteAgent(agent.id)
    }
  }

  // Update the getEditLink function to direct to the correct step based on agent status
  const getEditLink = () => {
    if (agent.status === "draft") {
      // For draft agents, go to the first step
      return `/dashboard/agents/${agent.id}/create`
    }
    // For active agents, go to the information step
    return `/dashboard/agents/${agent.id}/informations`
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gray-50 p-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-lg truncate">{agent.name}</h3>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              agent.status === "active"
                ? "bg-green-100 text-green-800"
                : agent.status === "draft"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
            }`}
          >
            {agent.status === "active" ? "Actif" : agent.status === "draft" ? "Brouillon" : agent.status}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="text-sm text-gray-500">
          <p>Créé {formatDistanceToNow(new Date(agent.created_at), { addSuffix: true, locale: fr })}</p>
          <p>Mis à jour {formatDistanceToNow(new Date(agent.updated_at), { addSuffix: true, locale: fr })}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 flex justify-between">
        <Link href={getEditLink()}>
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </Button>
        </Link>
        <Button
          variant="outline"
          size="sm"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleDelete}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Supprimer
        </Button>
      </CardFooter>
    </Card>
  )
}
