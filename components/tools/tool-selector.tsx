"use client"

import { useState, useEffect } from "react"
import { useSubscription } from "@/hooks/use-subscription"
import { supabase } from "@/lib/supabase-client"

interface Tool {
  id: string
  name: string
  description: string
  type: string
  is_active: boolean
}

interface ToolSelectorProps {
  agentId: number
  onToolsChange?: (selectedTools: string[]) => void
}

export function ToolSelector({ agentId, onToolsChange }: ToolSelectorProps) {
  const [tools, setTools] = useState<Tool[]>([])
  const [selectedTools, setSelectedTools] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const { isToolAvailable } = useSubscription()

  // Charger tous les outils disponibles
  useEffect(() => {
    async function loadTools() {
      setLoading(true)

      try {
        // Récupérer tous les outils actifs
        const { data: allTools, error } = await supabase.from("tools").select("*").eq("is_active", true)

        if (error) throw error

        // Filtrer les outils selon le plan de l'utilisateur
        const availableTools: Tool[] = []

        for (const tool of allTools || []) {
          const isAvailable = await isToolAvailable(tool.id)
          if (isAvailable) {
            availableTools.push(tool as Tool)
          }
        }

        setTools(availableTools)

        // Récupérer les outils déjà sélectionnés pour cet agent
        if (agentId) {
          const { data: agentTools, error: agentToolsError } = await supabase
            .from("agent_tools")
            .select("tool_id")
            .eq("agent_id", agentId)
            .eq("is_enabled", true)

          if (!agentToolsError && agentTools) {
            const selectedToolIds = agentTools.map((item) => item.tool_id as string)
            setSelectedTools(selectedToolIds)
            onToolsChange?.(selectedToolIds)
          }
        }
      } catch (err) {
        console.error("Error loading tools:", err)
      } finally {
        setLoading(false)
      }
    }

    loadTools()
  }, [agentId, isToolAvailable, onToolsChange])

  // Gérer la sélection/désélection d'un outil
  const handleToolToggle = (toolId: string) => {
    setSelectedTools((prev) => {
      const isSelected = prev.includes(toolId)
      const newSelection = isSelected ? prev.filter((id) => id !== toolId) : [...prev, toolId]

      onToolsChange?.(newSelection)
      return newSelection
    })
  }

  if (loading) {
    return <div className="p-4">Chargement des outils...</div>
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Outils disponibles</h3>

      {tools.length === 0 ? (
        <p className="text-sm text-gray-500">Aucun outil disponible pour votre plan.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedTools.includes(tool.id)
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleToolToggle(tool.id)}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{tool.name}</h4>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    tool.type === "basic"
                      ? "bg-gray-100 text-gray-800"
                      : tool.type === "advanced"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {tool.type}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{tool.description}</p>

              <div className="mt-3 flex items-center">
                <div className="w-4 h-4 rounded-full border flex items-center justify-center mr-2">
                  {selectedTools.includes(tool.id) && <div className="w-2 h-2 rounded-full bg-primary" />}
                </div>
                <span className="text-sm">{selectedTools.includes(tool.id) ? "Sélectionné" : "Sélectionner"}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
