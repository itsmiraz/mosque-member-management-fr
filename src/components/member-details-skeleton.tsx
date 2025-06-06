import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, DollarSign, User, Beef } from "lucide-react"

export function MemberHeaderSkeleton() {
  return (
    <div className="mb-8">
      <Button variant="ghost" className="mb-4" disabled>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-9 w-20" />
        </div>
      </div>
    </div>
  )
}

export function TotalDueCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Total Due
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-10 w-24 mb-4" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-40" />
        </div>
      </CardContent>
    </Card>
  )
}

export function PaymentHistorySkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Payment History
            </CardTitle>
            <CardDescription>Monthly payment status</CardDescription>
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
          {Array.from({ length: 12 }).map((_, index) => (
            <Skeleton key={index} className="h-16 w-full rounded-lg" />
          ))}
        </div>

        {/* Meat Taken Status Skeleton */}
        <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Beef className="h-4 w-4 text-orange-600" />
              <Skeleton className="h-5 w-40" />
            </div>
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function MemberDetailsSidebarSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Member Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Name */}
        <div>
          <label className="text-sm font-medium text-muted-foreground">Name</label>
          <Skeleton className="h-6 w-full mt-1" />
        </div>

        {/* Member ID */}
        <div>
          <label className="text-sm font-medium text-muted-foreground">Member ID</label>
          <Skeleton className="h-6 w-24 mt-1" />
        </div>

        {/* Phone */}
        <div>
          <label className="text-sm font-medium text-muted-foreground">Phone</label>
          <Skeleton className="h-6 w-full mt-1" />
        </div>

        {/* Address */}
        <div>
          <label className="text-sm font-medium text-muted-foreground">Address</label>
          <Skeleton className="h-12 w-full mt-1" />
        </div>

        {/* Membership Start */}
        <div>
          <label className="text-sm font-medium text-muted-foreground">Membership Start</label>
          <Skeleton className="h-6 w-32 mt-1" />
        </div>

        {/* Status */}
        <div>
          <label className="text-sm font-medium text-muted-foreground">Status</label>
          <div>
            <Skeleton className="h-6 w-16 mt-1" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function MemberDetailsPageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <MemberHeaderSkeleton />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <TotalDueCardSkeleton />
            <PaymentHistorySkeleton />
          </div>

          <div className="space-y-6">
            <MemberDetailsSidebarSkeleton />
          </div>
        </div>
      </div>
    </div>
  )
}
