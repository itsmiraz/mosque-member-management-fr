"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Beef,
  Users,
  CheckCircle,
  XCircle,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toggleMeatTaken } from "@/lib/data";
import { MeatDistributionModal } from "@/components/meat-distribution-modal";
import {
  useGetMembersByMeatStatusQuery,
  useMarkAsNotTakenMeatMutation,
  useMarkMeatTakenMutation,
} from "@/redux/feature/members/membersApi";
import { useDebounce } from "@/hooks/useDebounce";
import { TMember } from "@/redux/feature/members/memberType";
import { handleApiRequest } from "@/utils/handleApiRequest";
import { useAppSelector } from "@/redux/hooks/hooks";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MeatDistributionGridSkeleton,
} from "@/components/meat-distribution-skeleton";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

export default function MeatDistribution() {
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [searchTerm, setSearchTerm] = useState("");
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    memberId: string;
    memberName: string;
    currentStatus: boolean;
    action: "mark_taken" | "mark_not_taken";
  }>({
    isOpen: false,
    memberId: "",
    memberName: "",
    currentStatus: false,
    action: "mark_taken",
  });

  const debouncedSearchTerm = useDebounce(searchTerm, 800);
  const { data, isLoading,  isError } =
    useGetMembersByMeatStatusQuery([
      {
        name: "page",
        value: 1,
      },
      {
        name: "year",
        value: selectedYear,
      },
      {
        name: "limit",
        value: 100,
      },
      {
        name: "searchTerm",
        value: debouncedSearchTerm,
      },
    ]);
  //  total,
  //   page: Number(page),
  //   limit: Number(limit),
  //   year,
  //   meatTakenCount,
  //   meatNotTakenCount,
  const membersMeta: {
    total: number;
    page: number;
    limit: number;
    year: number;
    meatTakenCount: number;
    meatNotTakenCount: number;
  } = data?.data?.meta;
  const members = data?.data?.data;

  // const filteredMembers = members.filter(
  //   (member) =>
  //     member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     member.id.toLowerCase().includes(searchTerm.toLowerCase()),
  // )

  // const getMeatStatus = (memberId: string) => {
  //   return meatTaken[memberId]?.[selectedYear] || false
  // }

  // const getStats = () => {
  //   const totalMembers = members.length
  //   const takenCount = members.filter((member) => getMeatStatus(member.id)).length
  //   const notTakenCount = totalMembers - takenCount
  //   const completionRate = totalMembers > 0 ? Math.round((takenCount / totalMembers) * 100) : 0

  //   return { totalMembers, takenCount, notTakenCount, completionRate }
  // }

  const handleMeatStatusClick = (
    memberId: string,
    memberName: string,
    currentStatus: boolean
  ) => {
    setModalState({
      isOpen: true,
      memberId,
      memberName,
      currentStatus,
      action: currentStatus ? "mark_not_taken" : "mark_taken",
    });
  };

  const [markAsMeatTaken, { isLoading: isMarking }] =
    useMarkMeatTakenMutation();
  const [markAsNotTaken, { isLoading: isMarkingAsNotTaken }] =
    useMarkAsNotTakenMeatMutation();
  const user = useAppSelector((state) => state.auth.user);
  const handleConfirmAction = async () => {
    const payload = {
      memberId: modalState.memberId,

      year: selectedYear,

      adminId: user?.email,
    };
    await handleApiRequest({
      payload: payload,
      requestFunction:
        modalState.action === "mark_taken" ? markAsMeatTaken : markAsNotTaken,
      onSuccess: (res) => {
        console.log(res);
        toast.success("Success");
        toggleMeatTaken(modalState.memberId, selectedYear);
        setModalState((prev) => ({ ...prev, isOpen: false }));
      },
      onError: (err) => {
        console.log(err);
        toast.success("Some thing went wrong");
      },
    });
  };

  const handleCloseModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  // console.log(membersMeta);
  console.log(members);
  // const stats = getStats()
  const progressPercentage =
    membersMeta?.total > 0
      ? Math.round((membersMeta?.meatTakenCount / membersMeta?.total) * 100)
      : 0;
 
  if (isError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Something Went Wrong</h1>
          {/* <Link href="/">
            <Button>Back to Dashboard</Button>
          </Link> */}
        </div>
      </div>
    );
  }
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
              <p className="text-muted-foreground md:block hidden">
                Track Qurbani/Udhiya meat distribution for {selectedYear}
              </p>
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
              <CardTitle className="text-sm font-medium">
                Total Members
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{membersMeta?.total}</div>
              <p className="text-xs text-muted-foreground">
                Active and inactive
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Meat Taken</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <>
                  <Skeleton className="h-6 md:h-8 w-12 mb-2" />
                  <Skeleton className="h-3 w-20" />
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold text-green-600">
                    {membersMeta?.meatTakenCount}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Members received meat
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Not Taken</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <>
                  <Skeleton className="h-6 md:h-8 w-8 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold text-red-600">
                    {membersMeta?.meatNotTakenCount}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Pending distribution
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <>
                  <Skeleton className="h-6 md:h-8 w-8 mb-2" />
                  <Skeleton className="h-3 w-16" />
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {progressPercentage}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Distribution progress
                  </p>
                </>
              )}
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

        {/* Members Grid */}
        {isLoading ? (
          <>
            <MeatDistributionGridSkeleton />
            {/* <MeatDistributionProgressSkeleton /> */}
          </>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="">Member Distribution Status</CardTitle>
              <CardDescription>
                Click on any member to update their meat distribution status for{" "}
                {selectedYear}
              </CardDescription>
            </CardHeader>
            {isLoading ? (
              <div></div>
            ) : (
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {members.map((member: TMember) => {
                    console.log(member.meatTaken);
                    const isTaken = member.meatTaken[selectedYear] || false;

                    return (
                      <div
                        key={member.memberId}
                        className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                          isTaken
                            ? "bg-green-50 border-green-200 hover:bg-green-100"
                            : "bg-red-50 border-red-200 hover:bg-red-100"
                        }`}
                        onClick={() =>
                          handleMeatStatusClick(
                            member.memberId,
                            member.name,
                            isTaken
                          )
                        }
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-sm">
                              {member.name}
                            </h3>
                            <Badge
                              variant={
                                member.status === "active"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs capitalize"
                            >
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
                          <div className="text-xs text-muted-foreground">
                            ID: {member.memberId}
                          </div>
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
                                e.stopPropagation();
                                handleMeatStatusClick(
                                  member.memberId,
                                  member.name,
                                  isTaken
                                );
                              }}
                            >
                              {isTaken ? "Mark Not Taken" : "Mark as Taken"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {members.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No members found matching your search criteria.
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        )}

        <MeatDistributionModal
          isMarking={isMarking || isMarkingAsNotTaken}
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
  );
}
