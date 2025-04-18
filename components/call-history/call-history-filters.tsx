"use client"

import type React from "react"

import { useState } from "react"
import { Search, Calendar, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export interface CallHistoryFilters {
  date?: string
  agent?: number
  phoneNumber?: string
}

interface CallHistoryFiltersProps {
  filters: CallHistoryFilters
  onFilterChange: (filters: Partial<CallHistoryFilters>) => void
  agents: { id: number; name: string }[]
}

export function CallHistoryFilters({ filters = {}, onFilterChange, agents }: CallHistoryFiltersProps) {
  // Initialize date state safely, ensuring it's not undefined
  const [date, setDate] = useState<Date | undefined>(filters.date ? new Date(filters.date) : undefined)

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    setDate(date)
    if (date) {
      onFilterChange({ date: format(date, "yyyy-MM-dd") })
    } else {
      onFilterChange({ date: undefined })
    }
  }

  // Handle agent selection
  const handleAgentChange = (value: string) => {
    onFilterChange({ agent: value === "all" ? undefined : Number(value) })
  }

  // Handle phone number search
  const handlePhoneSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ phoneNumber: e.target.value || undefined })
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      {/* Date filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full sm:w-auto justify-start">
            <Calendar className="mr-2 h-4 w-4" />
            {date ? format(date, "dd/MM/yy", { locale: fr }) : "Date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent mode="single" selected={date} onSelect={handleDateSelect} initialFocus locale={fr} />
        </PopoverContent>
      </Popover>

      {/* Agent filter */}
      <Select value={filters.agent?.toString() || "all"} onValueChange={handleAgentChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <div className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Agent" />
          </div>
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

      {/* Phone number search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Numéro de téléphone"
          value={filters.phoneNumber || ""}
          onChange={handlePhoneSearch}
          className="pl-9"
        />
      </div>
    </div>
  )
}
