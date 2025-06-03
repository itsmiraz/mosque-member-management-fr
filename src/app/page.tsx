"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, Users, Calendar, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { members, getLastPaymentMonth, getTotalDue } from "@/lib/data"
import { AddMemberModal, type NewMemberData } from "@/components/add-member-modal"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false)

  const filteredMembers = useMemo(() => {
    return members.filter(
      (member) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.id.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [searchTerm])

  const handleAddMember = (memberData: NewMemberData) => {
    const newMemberId = `M${String(members.length + 1).padStart(3, "0")}`
    const newMember = {
      id: newMemberId,
      ...memberData,
      membershipStartDate: memberData.membershipStartDate || new Date().toISOString().split("T")[0],
    }

    // Add to members array (in a real app, this would be an API call)
    members.push(newMember)
    setIsAddMemberModalOpen(false)
  }

  const totalMembers = members.length
  const activeMembers = members.filter((m) => m.status === "Active").length
  // const totalOutstanding = members.reduce((sum, member) => sum + getTotalDue(member.id), 0)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="flex md:flex-row flex-col items-start gap-4 md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Member Management Dashboard</h1>
            <p className="text-muted-foreground md:block hidden">Manage member payments and track Qurbani distribution</p>
          </div>
          <Button onClick={() => setIsAddMemberModalOpen(true)} className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Add Member
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMembers}</div>
              <p className="text-xs text-muted-foreground">{activeMembers} active members</p>
            </CardContent>
          </Card>
          {/* <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Outstanding Amount</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalOutstanding}</div>
              <p className="text-xs text-muted-foreground">Across all members</p>
            </CardContent>
          </Card> */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </div>
              <p className="text-xs text-muted-foreground">Current billing period</p>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by name or member ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-4"
            />
          </div>
        </div>

        {/* Members List */}
        <Card>
          <CardHeader>
            <CardTitle>Members List</CardTitle>
            <CardDescription>
              {filteredMembers.length} of {totalMembers} members
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="space-y-4 ">
              {filteredMembers.map((member) => {
                const lastPayment = getLastPaymentMonth(member.id)
                const totalDue = getTotalDue(member.id)

                return (
                 <div key={member.id} className="relative" >
                   <Link href={`/member/${member.id}`}>
                    <div className="flex items-end md:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex-1 ">
                        <div className="flex md:justify-start justify-between items-center gap-4 mb-2">
                          <h3 className="font-semibold">{member.name}</h3>
                          <Badge className="md:relative md:block rounded-full  absolute md:top-0 md:right-0 top-2 right-2" variant={member.status === "Active" ? "default" : "secondary"}>{member.status}</Badge>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <span>ID: {member.id}</span> <br />
                          <span>Last Payment: {lastPayment || "Never"}</span>
                        </div>
                      </div>
                      <div className="text-right   flex-col flex justify-end items-end">
                        <div className="text-lg font-semibold">${totalDue}</div>
                        <div className="text-sm text-muted-foreground">Total Due</div>
                      </div>
                    </div>
                  </Link>
                 </div>
                )
              })}

              {filteredMembers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">No members found matching your search.</div>
              )}
            </div>
          </CardContent>
        </Card>
        <AddMemberModal
          isOpen={isAddMemberModalOpen}
          onClose={() => setIsAddMemberModalOpen(false)}
          onSubmit={handleAddMember}
        />
      </div>
    </div>
  )
}
