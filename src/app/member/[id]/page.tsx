"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Phone,
  MapPin,
  User,
  Beef,
  Edit,
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
import { PaymentModal } from "@/components/payment-modal";
import {
  // meatTaken,
  // getPaymentStatus,
  updatePayments,
  toggleMeatTaken,
} from "@/lib/data";
import { useGetSingleMemberQuery } from "@/redux/feature/members/membersApi";
import { TMember } from "@/redux/feature/members/memberType";
import { getTotalDue } from "@/utils/getTotalDue";
import { UpdateMemberModal } from "@/components/update-member-modal";
import { MemberDetailsPageSkeleton } from "@/components/member-details-skeleton";

const months = [
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
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

export default function MemberDetails({ params }: { params: { id: string } }) {
  const { id } = params;
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
 const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  // const member = getMemberById(id)
  const { data ,isLoading} = useGetSingleMemberQuery(id as string, { skip: !id });
  const member: TMember = data?.data;
 
  const handleUpdateMember=()=>{

  }
  // Show skeleton while loading
  if (isLoading) {
    return <MemberDetailsPageSkeleton />
  }
 
  if (!member) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Member Not Found</h1>
          <Link href="/">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const totalDue = getTotalDue(member);

  const isMeatTaken = member?.meatTaken?.[selectedYear] || false;

  const handlePaymentSubmit = (
    selectedMonths: string[],
    paymentMethod: string
  ) => {
    updatePayments(
      id,
      Number.parseInt(selectedYear),
      selectedMonths,
      paymentMethod
    );
    setIsPaymentModalOpen(false);
  };

  const handleToggleMeatTaken = () => {
    toggleMeatTaken(id, selectedYear);
  };
  const getUnpaidMonths = () => {
    return months.filter((_, index) => {
      const paymentExists = member.payments.some(
        (p) => p.year === Number(selectedYear) && p.month === index + 1
      );
      return !paymentExists;
    });
  };

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
              <h1 className="text-3xl font-bold tracking-tight">
                {member.name}
              </h1>
              <h1 className="text-3xl font-bold tracking-tight">
                {member.name_in_bengali}
              </h1>
              <p className="text-muted-foreground">
                Member ID: {member.memberId}
              </p>
            </div>
               <div className="flex items-center gap-2">
              <Badge variant={member?.status === "active" ? "default" : "secondary"} className="text-sm">
                {member?.status}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => setIsUpdateModalOpen(true)}
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Payment History Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Total Due Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Total Due
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">${totalDue}</div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setIsPaymentModalOpen(true)}
                    disabled={getUnpaidMonths().length === 0}
                  >
                    Make Payment
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleToggleMeatTaken}
                    className="flex items-center gap-2"
                  >
                    <Beef className="h-4 w-4" />
                    {isMeatTaken ? "Mark Meat Not Taken" : "Mark Meat Taken"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Payment History */}
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
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {months.map((month, index) => {
                    // const status = member.payments.find(
                    //   (p) =>
                    //     p.year === Number(selectedYear) && p.month === index + 1
                    // );

                    const payment = member.payments.find(
                      (p) =>
                        p.year === Number(selectedYear) && p.month === index + 1
                    );
                    return (
                      <div
                        key={month}
                        className={`p-3 rounded-lg border text-center transition-colors ${
                          payment
                            ? "bg-green-50 border-green-200 text-green-800"
                            : "bg-gray-50 border-gray-200 text-gray-500"
                        }`}
                      >
                        <div className="font-medium text-sm">
                          {month.slice(0, 3)}
                        </div>
                        <div className="mt-1">
                          {payment ? (
                            <div className="text-green-600 text-xs">
                              ✓ Paid
                              <div className="text-xs text-green-500 mt-1">
                                {new Date(payment.paidAt).toLocaleDateString()}
                              </div>
                            </div>
                          ) : (
                            <div className="text-gray-400 text-xs">Unpaid</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Meat Taken Status */}
                <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Beef className="h-4 w-4 text-orange-600" />
                      <span className="font-medium text-orange-800">
                        {selectedYear} Qurbani/Udhiya Status
                      </span>
                    </div>
                    <Badge variant={isMeatTaken ? "default" : "secondary"}>
                      {isMeatTaken ? "Meat Taken ✅" : "Not Taken"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Member Details Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Member Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Name
                  </label>
                  <div className="font-medium">{member.name}</div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Member ID
                  </label>
                  <div className="font-medium">{member.memberId}</div>
                </div>

                {member.phone && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Phone
                    </label>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{member.phone}</span>
                    </div>
                  </div>
                )}

                {member.address && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Address
                    </label>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span className="text-sm">{member.address}</span>
                    </div>
                  </div>
                )}
                {/* 
                {member.membershipStartDate && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Membership Start</label>
                    <div className="font-medium">{member.membershipStartDate}</div>
                  </div>
                )} */}

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Status
                  </label>
                  <div>
                    <Badge
                      variant={
                        member.status === "active" ? "default" : "secondary"
                      }
                    >
                      {member.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onSubmit={handlePaymentSubmit}
          unpaidMonths={getUnpaidMonths()}
          year={selectedYear}
          memberName={member.name}
        />
           <UpdateMemberModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          onSubmit={handleUpdateMember}
          member={member}
        />
      </div>
    </div>
  );
}
