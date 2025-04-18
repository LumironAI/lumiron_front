import { Skeleton } from "@/components/ui/skeleton"
import { PageHeader } from "@/components/header/page-header"

export default function Loading() {
  return (
    <div className="p-6 bg-[#f4f9ff]">
      <div className="flex items-center justify-between mb-8">
        <PageHeader title="Historique" />
        <div className="w-24">
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>

      {/* Filters skeleton */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Skeleton className="h-10 w-32 rounded-lg" />
        <Skeleton className="h-10 w-32 rounded-lg" />
        <Skeleton className="h-10 flex-1 rounded-lg" />
      </div>

      {/* Table skeleton */}
      <div className="rounded-lg border bg-white">
        <div className="h-12 border-b px-4 flex items-center">
          <div className="flex gap-6 w-full">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="p-4 space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex gap-6 w-full">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-5 w-8" />
              <Skeleton className="h-5 w-32" />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination skeleton */}
      <div className="flex justify-center mt-6">
        <div className="flex gap-2">
          <Skeleton className="h-9 w-9 rounded-lg" />
          <Skeleton className="h-9 w-9 rounded-lg" />
          <Skeleton className="h-9 w-9 rounded-lg" />
          <Skeleton className="h-9 w-9 rounded-lg" />
        </div>
      </div>
    </div>
  )
}
