"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Receipt, User, Calendar, CreditCard, Hash, Clock, CalendarDays } from "lucide-react"
import { getMemberById } from "@/lib/data"

interface TransactionWithMember {
  id: string
  memberId: string
  memberName: string
  year: number
  months: number[]
  monthNames: string[]
  date: string
  method: string
  amount: number
  isMultiMonth: boolean
  monthRange?: string
}

interface TransactionDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  transaction: TransactionWithMember
}

const MONTHLY_FEE = 50

export function TransactionDetailsModal({ isOpen, onClose, transaction }: TransactionDetailsModalProps) {
  const member = getMemberById(transaction.memberId)

  const formatPaymentMethod = (method: string) => {
    return method
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      full: date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case "cash":
        return "bg-green-100 text-green-800"
      case "bank_transfer":
        return "bg-blue-100 text-blue-800"
      case "check":
        return "bg-purple-100 text-purple-800"
      case "online":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const dateInfo = formatDate(transaction.date)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-blue-600" />
            Transaction Details
          </DialogTitle>
          <DialogDescription>Complete information for transaction {transaction.id}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Transaction Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Hash className="h-5 w-5" />
                Transaction Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Transaction ID</label>
                  <div className="font-mono text-lg">{transaction.id}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Total Amount</label>
                  <div className="text-2xl font-bold text-green-600">${transaction.amount}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Payment Type</label>
                  <div className="flex items-center gap-2">
                    {transaction.isMultiMonth ? (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Multi-Month Payment
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Single Month</Badge>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Payment Method</label>
                  <Badge className={`${getMethodColor(transaction.method)} border-0`}>
                    {formatPaymentMethod(transaction.method)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Period Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Payment Period Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Year</label>
                  <div className="font-semibold text-lg">{transaction.year}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    {transaction.isMultiMonth ? "Months Covered" : "Month"}
                  </label>
                  <div className="font-semibold">
                    {transaction.isMultiMonth ? `${transaction.months.length} months` : transaction.monthNames[0]}
                  </div>
                </div>
              </div>

              {transaction.isMultiMonth && (
                <>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Month Range</label>
                    <div className="font-semibold">{transaction.monthRange}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Individual Months</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {transaction.monthNames.map((month, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {month}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Monthly Fee</label>
                      <div>${MONTHLY_FEE}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Calculation</label>
                      <div>
                        ${MONTHLY_FEE} × {transaction.months.length} = ${transaction.amount}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Member Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Member Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Member Name</label>
                  <div className="font-semibold text-lg">{transaction.memberName}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Member ID</label>
                  <div className="font-mono">{transaction.memberId}</div>
                </div>
              </div>

              {member && (
                <>
                  <Separator />
                  <div className="grid grid-cols-1 gap-4">
                    {member.phone && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                        <div>{member.phone}</div>
                      </div>
                    )}
                    {member.address && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Address</label>
                        <div className="text-sm">{member.address}</div>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Member Status</label>
                        <div>
                          <Badge variant={member.status === "Active" ? "default" : "secondary"}>{member.status}</Badge>
                        </div>
                      </div>
                      {member.membershipStartDate && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                          <div>{new Date(member.membershipStartDate).toLocaleDateString()}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Payment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Payment Date
                  </label>
                  <div className="font-semibold">{dateInfo.full}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Time: {dateInfo.time}
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Fee Type</label>
                    <div>{transaction.isMultiMonth ? "Multi-Month Membership Fee" : "Monthly Membership Fee"}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Total Amount</label>
                    <div className="font-semibold">${transaction.amount}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* For Notebook Entry */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-blue-800">
                <Receipt className="h-5 w-5" />
                For Notebook Entry
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="font-mono text-sm bg-white p-3 rounded border">
                <div>
                  <strong>Date:</strong> {new Date(transaction.date).toLocaleDateString()}
                </div>
                <div>
                  <strong>Member:</strong> {transaction.memberName} ({transaction.memberId})
                </div>
                <div>
                  <strong>Period:</strong>{" "}
                  {transaction.isMultiMonth ? transaction.monthRange : transaction.monthNames[0]} {transaction.year}
                </div>
                <div>
                  <strong>Amount:</strong> ${transaction.amount}
                  {transaction.isMultiMonth && (
                    <span className="text-muted-foreground">
                      {" "}
                      (${MONTHLY_FEE} × {transaction.months.length} months)
                    </span>
                  )}
                </div>
                <div>
                  <strong>Method:</strong> {formatPaymentMethod(transaction.method)}
                </div>
                <div>
                  <strong>Type:</strong> {transaction.isMultiMonth ? "Multi-Month Payment" : "Single Month Payment"}
                </div>
                <div>
                  <strong>Ref:</strong> {transaction.id}
                </div>
              </div>
              <p className="text-xs text-blue-700">
                Copy the above information to your physical notebook for record keeping.
              </p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
