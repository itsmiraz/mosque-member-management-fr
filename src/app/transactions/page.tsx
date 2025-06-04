"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ArrowLeft, Receipt, Calendar, DollarSign, User, Filter, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { payments, getMemberById } from "@/lib/data"
import { TransactionDetailsModal } from "@/components/transaction-details-modal"

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

const MONTHLY_FEE = 50

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const paymentMethods = ["all", "cash", "bank_transfer", "check", "online"]

// Get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  return new Date().toISOString().split("T")[0]
}

export default function Transactions() {
  const [dateFrom, setDateFrom] = useState(getTodayDate())
  const [dateTo, setDateTo] = useState(getTodayDate())
  const [searchTerm, setSearchTerm] = useState("")
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all")
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionWithMember | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Group payments by member, date, and method to identify multi-month payments
  const allTransactions: TransactionWithMember[] = useMemo(() => {
    // Group payments by member, date, and method
    const paymentGroups = payments.reduce(
      (groups, payment) => {
        const key = `${payment.memberId}-${payment.date}-${payment.method}-${payment.year}`
        if (!groups[key]) {
          groups[key] = []
        }
        groups[key].push(payment)
        return groups
      },
      {} as Record<string, typeof payments>,
    )

    // Convert groups to transactions
    const transactions: TransactionWithMember[] = []
    let transactionIndex = 1

    Object.values(paymentGroups).forEach((group) => {
      const member = getMemberById(group[0].memberId)
      const months = group.map((p) => p.month).sort((a, b) => a - b)
      const monthNamesArray = months.map((m) => monthNames[m - 1])
      const isMultiMonth = months.length > 1

      let monthRange = ""
      if (isMultiMonth) {
        if (months.length === 2) {
          monthRange = `${monthNames[months[0] - 1]} - ${monthNames[months[1] - 1]}`
        } else if (months.length > 2) {
          // Check if months are consecutive
          const isConsecutive = months.every((month, index) => {
            if (index === 0) return true
            return month === months[index - 1] + 1
          })

          if (isConsecutive) {
            monthRange = `${monthNames[months[0] - 1]} - ${monthNames[months[months.length - 1] - 1]}`
          } else {
            monthRange = `${monthNames[months[0] - 1]}, ${monthNames[months[1] - 1]}${
              months.length > 2 ? ` +${months.length - 2} more` : ""
            }`
          }
        }
      }

      transactions.push({
        id: `TXN-${String(transactionIndex).padStart(4, "0")}`,
        memberId: group[0].memberId,
        memberName: member?.name || "Unknown Member",
        year: group[0].year,
        months,
        monthNames: monthNamesArray,
        date: group[0].date,
        method: group[0].method,
        amount: months.length * MONTHLY_FEE,
        isMultiMonth,
        monthRange,
      })

      transactionIndex++
    })

    return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [])

  // Filter transactions based on criteria
  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((transaction) => {
      // Date range filter
      if (dateFrom && new Date(transaction.date) < new Date(dateFrom)) return false
      if (dateTo && new Date(transaction.date) > new Date(dateTo)) return false

      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        if (
          !transaction.memberName.toLowerCase().includes(searchLower) &&
          !transaction.memberId.toLowerCase().includes(searchLower) &&
          !transaction.id.toLowerCase().includes(searchLower)
        ) {
          return false
        }
      }

      // Payment method filter
      if (paymentMethodFilter !== "all" && transaction.method !== paymentMethodFilter) {
        return false
      }

      return true
    })
  }, [allTransactions, dateFrom, dateTo, searchTerm, paymentMethodFilter])

  const getStats = () => {
    const totalTransactions = filteredTransactions.length
    const totalAmount = filteredTransactions.reduce((sum, t) => sum + t.amount, 0)
    const uniqueMembers = new Set(filteredTransactions.map((t) => t.memberId)).size
    const multiMonthTransactions = filteredTransactions.filter((t) => t.isMultiMonth).length

    const methodCounts = filteredTransactions.reduce(
      (acc, t) => {
        acc[t.method] = (acc[t.method] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return { totalTransactions, totalAmount, uniqueMembers, multiMonthTransactions, methodCounts }
  }

  const handleViewDetails = (transaction: TransactionWithMember) => {
    setSelectedTransaction(transaction)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedTransaction(null)
  }

  const clearFilters = () => {
    setDateFrom(getTodayDate())
    setDateTo(getTodayDate())
    setSearchTerm("")
    setPaymentMethodFilter("all")
  }

  const formatPaymentMethod = (method: string) => {
    return method
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const stats = getStats()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                <Receipt className="h-8 w-8 text-blue-600" />
                Recent Transactions
              </h1>
              <p className="text-muted-foreground md:block hidden">View and track all member payment transactions</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTransactions}</div>
              <p className="text-xs text-muted-foreground">{stats.multiMonthTransactions} multi-month payments</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalAmount}</div>
              <p className="text-xs text-muted-foreground">Revenue collected</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Members</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.uniqueMembers}</div>
              <p className="text-xs text-muted-foreground">Made payments</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg per Transaction</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.totalTransactions > 0 ? (stats.totalAmount / stats.totalTransactions).toFixed(0) : 0}
              </div>
              <p className="text-xs text-muted-foreground">Average amount</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <div className="space-y-2">
                <Label htmlFor="dateFrom">From Date</Label>
                <Input id="dateFrom" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateTo">To Date</Label>
                <Input id="dateTo" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Member name, ID, or transaction ID"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method === "all" ? "All Methods" : formatPaymentMethod(method)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button variant="outline" onClick={clearFilters} className="w-full">
                  Reset to Today
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>{filteredTransactions.length} transactions found</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{transaction.memberName}</h3>
                      <Badge variant="outline">{transaction.id}</Badge>
                      <Badge variant="secondary">{formatPaymentMethod(transaction.method)}</Badge>
                      {transaction.isMultiMonth && (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          Multi-Month
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <span>Member ID: {transaction.memberId}</span>
                      <span>
                        Period: {transaction.isMultiMonth ? transaction.monthRange : transaction.monthNames[0]}{" "}
                        {transaction.year}
                      </span>
                      <span>Date: {new Date(transaction.date).toLocaleDateString()}</span>
                      {transaction.isMultiMonth && (
                        <span className="text-green-600 font-medium">{transaction.months.length} months</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-lg font-semibold">${transaction.amount}</div>
                      <div className="text-sm text-muted-foreground">
                        {transaction.isMultiMonth ? `$${MONTHLY_FEE} × ${transaction.months.length}` : "Monthly Fee"}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(transaction)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </Button>
                  </div>
                </div>
              ))}

              {filteredTransactions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No transactions found matching your criteria.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {selectedTransaction && (
          <TransactionDetailsModal isOpen={isModalOpen} onClose={handleCloseModal} transaction={selectedTransaction} />
        )}
      </div>
    </div>
  )
}
