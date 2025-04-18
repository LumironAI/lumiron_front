"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

interface CallHistoryTableProps {
  callLogs: any[]
  isLoading: boolean
  error: Error | null
}

export function CallHistoryTable({ callLogs = [], isLoading, error }: CallHistoryTableProps) {
  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        <p>Une erreur est survenue lors du chargement des données.</p>
        <p className="text-sm">{error.message}</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-white border-b border-gray-200">
            <TableHead className="py-4 text-sm font-medium text-gray-700">Date</TableHead>
            <TableHead className="py-4 text-sm font-medium text-gray-700">Heure</TableHead>
            <TableHead className="py-4 text-sm font-medium text-gray-700">Durée</TableHead>
            <TableHead className="py-4 text-sm font-medium text-gray-700">Agent</TableHead>
            <TableHead className="py-4 text-sm font-medium text-gray-700">Numéro de téléphone</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            // Loading state
            Array.from({ length: 3 }).map((_, index) => (
              <TableRow key={`loading-${index}`} className="bg-white">
                <TableCell>
                  <Skeleton className="h-5 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-12" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-8" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-32" />
                </TableCell>
              </TableRow>
            ))
          ) : callLogs.length === 0 ? (
            // Empty state
            <TableRow className="bg-white">
              <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                Aucun appel trouvé.
              </TableCell>
            </TableRow>
          ) : (
            // Data rows
            callLogs.map((call, index) => (
              <TableRow key={call?.id || `call-${index}`} className="bg-white">
                <TableCell className="py-4 text-sm">
                  {call?.created_at ? new Date(call.created_at).toLocaleDateString("fr-FR") : "N/A"}
                </TableCell>
                <TableCell className="py-4 text-sm">
                  {call?.created_at
                    ? new Date(call.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
                    : "N/A"}
                </TableCell>
                <TableCell className="py-4 text-sm">{call?.duration || "N/A"}</TableCell>
                <TableCell className="py-4 text-sm">{call?.agent_id || "N/A"}</TableCell>
                <TableCell className="py-4 text-sm">{call?.external_number || "N/A"}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
