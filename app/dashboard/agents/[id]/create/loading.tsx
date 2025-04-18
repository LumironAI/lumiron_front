import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="border-b">
          <div className="flex -mb-px space-x-8">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <Skeleton className="h-12 w-full mb-4" />

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-32 w-full rounded-md" />
            <Skeleton className="h-32 w-full rounded-md" />
            <Skeleton className="h-32 w-full rounded-md" />
            <Skeleton className="h-32 w-full rounded-md" />
            <Skeleton className="h-32 w-full rounded-md" />
            <Skeleton className="h-32 w-full rounded-md" />
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <div></div>
          <div className="flex gap-4">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    </div>
  )
}
