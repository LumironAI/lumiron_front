"use client"

import { useState, useEffect } from "react"
import { callHistoryService, type CallLogFilters, type CallLog } from "@/services/call-history.service"

export function useCallHistory(initialFilters: CallLogFilters = {}) {
  const [callLogs, setCallLogs] = useState<CallLog[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [filters, setFilters] = useState<CallLogFilters>(initialFilters)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchCallLogs = async () => {
      try {
        setIsLoading(true)
        const { data, count } = await callHistoryService.getCallLogs(filters)
        setCallLogs(data)
        setTotalCount(count)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch call logs"))
        console.error("Error fetching call logs:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCallLogs()
  }, [filters])

  const updateFilters = (newFilters: Partial<CallLogFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      // Reset to page 1 when filters change
      page: newFilters.page !== undefined ? newFilters.page : 1,
    }))
  }

  const refetch = async () => {
    setIsLoading(true)
    try {
      const { data, count } = await callHistoryService.getCallLogs(filters)
      setCallLogs(data)
      setTotalCount(count)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch call logs"))
      console.error("Error fetching call logs:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    callLogs,
    totalCount,
    isLoading,
    error,
    filters,
    updateFilters,
    refetch,
    pageCount: Math.ceil(totalCount / (filters.pageSize || 10)),
  }
}
