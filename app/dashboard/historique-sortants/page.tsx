"use client"

import { useState } from "react"
import { PageHeader } from "@/components/header/page-header"
import { UserNav } from "@/components/header/user-nav"
import { Card } from "@/components/ui/card"
import { CallHistoryTable } from "@/components/call-history/call-history-table"
import {
  CallHistoryFilters,
  type CallHistoryFilters as FilterType,
} from "@/components/call-history/call-history-filters"
import { CallHistoryPagination } from "@/components/call-history/call-history-pagination"
import { useCallLogs } from "@/hooks/use-call-logs"

export default function HistoriqueSortantsPage() {
  const { callLogs, isLoading, error } = useCallLogs()
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState<FilterType>({})
  const [filteredLogs, setFilteredLogs] = useState<any[] | null>(null)
  const itemsPerPage = 10

  // Mock agents data for the filter
  const mockAgents = [
    { id: 1, name: "Agent 1" },
    { id: 2, name: "Agent 2" },
    { id: 3, name: "Agent 3" },
  ]

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<FilterType>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)

    // Apply filters to logs
    if (callLogs) {
      const filtered = callLogs.filter((log) => {
        // Filter by date
        if (
          updatedFilters.date &&
          new Date(log.created_at).toDateString() !== new Date(updatedFilters.date).toDateString()
        ) {
          return false
        }

        // Filter by agent
        if (updatedFilters.agent && log.agent_id !== updatedFilters.agent) {
          return false
        }

        // Filter by phone number
        if (updatedFilters.phoneNumber && !log.external_number?.includes(updatedFilters.phoneNumber)) {
          return false
        }

        return true
      })

      setFilteredLogs(filtered)
      setCurrentPage(1) // Reset to first page when filters change
    }
  }

  // Utilize the filtered logs if they exist, otherwise use all logs
  const logsToDisplay = filteredLogs || callLogs || []

  // Calculate the logs for the current page
  const paginatedLogs = logsToDisplay.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Calculate the total number of pages
  const totalPages = Math.ceil(logsToDisplay.length / itemsPerPage)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <PageHeader title="Historique des appels sortants" />
        <UserNav />
      </div>

      <Card className="p-6">
        <CallHistoryFilters filters={filters} onFilterChange={handleFilterChange} agents={mockAgents} />

        <CallHistoryTable callLogs={paginatedLogs} isLoading={isLoading} error={error} />

        {totalPages > 1 && (
          <CallHistoryPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        )}
      </Card>
    </div>
  )
}
