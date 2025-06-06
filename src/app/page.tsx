"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Users, Calendar, User, Beef, Receipt } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// import { members, getLastPaymentMonth, getTotalDue } from "@/lib/data";
import {
  AddMemberModal,
  type NewMemberData,
} from "@/components/add-member-modal";
import { Button } from "@/components/ui/button";
import { useGetAllMembersQuery } from "@/redux/feature/members/membersApi";
import { TMember } from "@/redux/feature/members/memberType";
import { getLastPaymentMonth } from "@/utils/getLastPaymentMonth";
import { getTotalDue } from "@/utils/getTotalDue";

// Custom hook for debounced search
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 800);
  const {data,isLoading,isFetching,error} = useGetAllMembersQuery([
    {
      name: "page",
      value: 1,
    },
    {
      name: "limit",
      value: 20,
    },
    {
      name: "searchTerm",
      value: debouncedSearchTerm,
    },
  ]);
  const membersMeta = data?.data?.meta
  const members = data?.data?.data

  const handleAddMember = (memberData: NewMemberData) => {
    const newMemberId = `M৳{String(members.length + 1).padStart(3, "0")}`
    // const newMember = {
    //   id: newMemberId,
    //   ...memberData,
    //   membershipStartDate: memberData.membershipStartDate || new Date().toISOString().split("T")[0],
    // }
  }
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Member Management Dashboard
            </h1>
            <p className="text-muted-foreground md:block hidden text-sm md:text-base">
              Manage member payments and track Qurbani distribution
            </p>
          </div>
          <div className="flex gap-2">
            {/* Desktop Navigation - Hidden on mobile */}
            <div className="hidden md:flex gap-2">
              <Link href="/transactions">
                <Button variant="outline" className="flex items-center gap-2">
                  <Receipt className="h-4 w-4" />
                  Transactions
                </Button>
              </Link>
              <Link href="/meat-distribution">
                <Button variant="outline" className="flex items-center gap-2">
                  <Beef className="h-4 w-4" />
                  Meat Distribution
                </Button>
              </Link>
            </div>
            <Button
              onClick={() => setIsAddMemberModalOpen(true)}
              className="flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Add Member</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Members
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{membersMeta?.total}</div>
              <p className="text-xs text-muted-foreground">
                {membersMeta?.total} active members
              </p>
            </CardContent>
          </Card>
        
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Date().toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                Current billing period
              </p>
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
              {members?.length} of {membersMeta?.total} members
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="space-y-4 ">
              {members?.map((member:TMember) => {
                const lastPayment = getLastPaymentMonth(member);
                const totalDue = getTotalDue(member);

                return (
                  <div key={member.memberId} className="relative">
                    <Link href={`/member/${member.memberId}`}>
                      <div className="flex items-end md:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className="flex-1 ">
                          <div className="flex md:justify-start justify-between items-center gap-4 mb-2">
                            <h3 className="font-semibold">{member.name}</h3>
                            <Badge
                              className="md:relative md:block rounded-full  absolute md:top-0 md:right-0 top-2 right-2"
                              variant={
                                member.status === "active"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {member.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <span>ID: {member.memberId}</span> <br />
                            <span>Last Payment: {lastPayment || "Never"}</span>
                          </div>
                        </div>
                        <div className="text-right   flex-col flex justify-end items-end">
                          <div className="text-lg font-semibold">
                            ৳{totalDue}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Total Due
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}

              {members?.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No members found matching your search.
                </div>
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
  );
}
