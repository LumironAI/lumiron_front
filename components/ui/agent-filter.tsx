"use client"
import { Users, ChevronDown } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface AgentFilterProps {
  value: string
  onValueChange: (value: string) => void
  agents: { id: number; name: string }[]
  className?: string
}

export function AgentFilter({ value, onValueChange, agents, className }: AgentFilterProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        className={cn(
          "h-10 bg-white border-gray-200 rounded-lg flex items-center justify-between gap-2 px-3",
          className,
        )}
      >
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-500" />
          <SelectValue placeholder="Agent" />
        </div>
        <ChevronDown className="h-4 w-4 text-gray-500 ml-auto" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Tous les agents</SelectItem>
        {agents.map((agent) => (
          <SelectItem key={agent.id} value={agent.id.toString()}>
            {agent.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
