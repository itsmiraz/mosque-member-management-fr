import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function MemberCardSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
      <div className="text-right ml-4">
        <Skeleton className="h-6 w-12 mb-1" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  )
}

export function MemberListSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-32" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-40" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <MemberCardSkeleton key={index} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
