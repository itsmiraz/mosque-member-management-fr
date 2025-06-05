"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Beef, Users, CheckCircle, XCircle, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { members, meatTaken, toggleMeatTaken } from "@/lib/data"
import { MeatDistributionModal } from "@/components/meat-distribution-modal"

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)

export default function MeatDistribution() {
  const [selectedYear, setSelectedYear] = useState(currentYear.toString())
  const [searchTerm, setSearchTerm] = useState("")
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    memberId: string
    memberName: string
    currentStatus: boolean
    action: "mark_taken" | "mark_not_taken"
  }>({
    isOpen: false,
    memberId: "",
    memberName: "",
    currentStatus: false,
    action: "mark_taken",
  })

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getMeatStatus = (memberId: string) => {
    return meatTaken[memberId]?.[selectedYear] || false
  }

  const getStats = () => {
    const totalMembers = members.length
    const takenCount = members.filter((member) => getMeatStatus(member.id)).length
    const notTakenCount = totalMembers - takenCount
    const completionRate = totalMembers > 0 ? Math.round((takenCount / totalMembers) * 100) : 0

    return { totalMembers, takenCount, notTakenCount, completionRate }
  }

  const handleMeatStatusClick = (memberId: string, memberName: string, currentStatus: boolean) => {
    setModalState({
      isOpen: true,
      memberId,
      memberName,
      currentStatus,
      action: currentStatus ? "mark_not_taken" : "mark_taken",
    })
  }

  const handleConfirmAction = () => {
    toggleMeatTaken(modalState.memberId, selectedYear)
    setModalState((prev) => ({ ...prev, isOpen: false }))
  }

  const handleCloseModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }))
  }

  const stats = getStats()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="md:block hidden">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-3xl font-bold tracking-tight flex items-center gap-3">
                <Beef className="h-8 w-8 text-orange-600" />
                Meat Distribution
              </h1>
              <p className="text-muted-foreground md:block hidden">Track Qurbani/Udhiya meat distribution for {selectedYear}</p>
            </div>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMembers}</div>
              <p className="text-xs text-muted-foreground">Active and inactive</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Meat Taken</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.takenCount}</div>
              <p className="text-xs text-muted-foreground">Members received meat</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Not Taken</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.notTakenCount}</div>
              <p className="text-xs text-muted-foreground">Pending distribution</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completionRate}%</div>
              <p className="text-xs text-muted-foreground">Distribution progress</p>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <Input
            placeholder="Search members by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Members Grid */}
        <Card>
          <CardHeader>
            <CardTitle className="">Member Distribution Status</CardTitle>
            <CardDescription>
              Click on any member to update their meat distribution status for {selectedYear}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredMembers.map((member) => {
                const isTaken = getMeatStatus(member.id)
                return (
                  <div
                    key={member.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      isTaken
                        ? "bg-green-50 border-green-200 hover:bg-green-100"
                        : "bg-red-50 border-red-200 hover:bg-red-100"
                    }`}
                    onClick={() => handleMeatStatusClick(member.id, member.name, isTaken)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm">{member.name}</h3>
                        <Badge variant={member.status === "Active" ? "default" : "secondary"} className="text-xs">
                          {member.status}
                        </Badge>
                      </div>
                      {isTaken ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground">ID: {member.id}</div>
                      <div className="flex items-center justify-between">
                        <Badge
                          variant={isTaken ? "default" : "destructive"}
                          className={`text-xs ${
                            isTaken
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-red-100 text-red-800 hover:bg-red-200"
                          }`}
                        >
                          {isTaken ? "✅ Meat Taken" : "❌ Not Taken"}
                        </Badge>
                        <Button
                          size="sm"
                          variant={isTaken ? "destructive" : "default"}
                          className="text-xs h-7"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleMeatStatusClick(member.id, member.name, isTaken)
                          }}
                        >
                          {isTaken ? "Mark Not Taken" : "Mark as Taken"}
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {filteredMembers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No members found matching your search criteria.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Progress Bar */}
        <Card className="mt-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Distribution Progress</span>
              <span className="text-sm text-muted-foreground">
                {stats.takenCount} of {stats.totalMembers} completed
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>0%</span>
              <span className="font-medium">{stats.completionRate}%</span>
              <span>100%</span>
            </div>
          </CardContent>
        </Card>

        <MeatDistributionModal
          isOpen={modalState.isOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmAction}
          memberName={modalState.memberName}
          memberId={modalState.memberId}
          action={modalState.action}
          year={selectedYear}
        />
      </div>
    </div>
  )
}
