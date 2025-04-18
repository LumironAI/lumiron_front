"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAgents, type Agent } from "@/hooks/use-agents"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Save, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface AgentFormProps {
  agent?: Agent
  isEdit?: boolean
}

export default function AgentForm({ agent, isEdit = false }: AgentFormProps) {
  const router = useRouter()
  const { createAgent, updateAgent } = useAgents()
  const [name, setName] = useState(agent?.name || "")
  const [status, setStatus] = useState(agent?.status || "draft")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      if (isEdit && agent) {
        await updateAgent(agent.id, { name, status })
      } else {
        await createAgent({ name, status })
      }
      router.push("/agents")
    } catch (err) {
      console.error("Error saving agent:", err)
      setError("Une erreur est survenue lors de l'enregistrement de l'agent.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? "Modifier l'agent" : "Créer un nouvel agent"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              <p>{error}</p>
            </div>
          )}

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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isEdit ? "Mettre à jour" : "Créer"}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
