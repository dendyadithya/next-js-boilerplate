import { Skeleton } from '@/components/ui/skeleton'

export function LoadingLayout() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="flex">
        {/* Sidebar skeleton with list items */}
        <div className="hidden h-screen w-64 space-y-4 border-r border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-zinc-800 lg:block">
          <Skeleton className="h-8 w-full" /> {/* Sidebar title */}
          <div className="space-y-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Skeleton className="h-6 w-6" /> {/* Icon */}
                <Skeleton className="h-6 flex-1" /> {/* Menu item text */}
              </div>
            ))}
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 p-6">
          {/* Main content area */}
          <div className="flex flex-1 items-center justify-between">
            <div className="mb-6 flex-1">
              <Skeleton className="mb-2 h-5 w-1/3" /> {/* Page title */}
              <Skeleton className="h-4 w-1/2" /> {/* Breadcrumbs or subtitle */}
            </div>
            <Skeleton className="hidden h-9 w-48 shrink-0 sm:block" />
          </div>

          {/* Card or main content skeleton */}
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-800">
            <div className="mb-4 flex items-center justify-between">
              <Skeleton className="h-8 w-1/4" /> {/* Card title */}
              <Skeleton className="h-10 w-24" /> {/* Action button */}
            </div>

            {/* Table or list skeleton */}
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" /> {/* Avatar or icon */}
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" /> {/* Name or title */}
                    <Skeleton className="h-3 w-1/2" /> {/* Description or metadata */}
                  </div>
                  <Skeleton className="h-8 w-20" /> {/* Action or status */}
                </div>
              ))}
            </div>

            {/* Pagination skeleton */}
            <div className="mt-6 flex items-center justify-between">
              <Skeleton className="h-8 w-20" /> {/* Previous button */}
              <div className="flex space-x-2">
                {[...Array(3)].map((_, index) => (
                  <Skeleton key={index} className="h-8 w-8" />
                ))}
              </div>
              <Skeleton className="h-8 w-20" /> {/* Next button */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
