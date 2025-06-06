"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Beef, CheckCircle, XCircle, User, Calendar } from "lucide-react";

interface MeatDistributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  memberName: string;
  memberId: string;
  action: "mark_taken" | "mark_not_taken";
  year: string;
  isMarking: boolean;
}

export function MeatDistributionModal({
  isOpen,
  onClose,
  onConfirm,
  isMarking,
  memberName,
  memberId,
  action,
  year,
}: MeatDistributionModalProps) {
  const isMarkingTaken = action === "mark_taken";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Beef className="h-5 w-5 text-orange-600" />
            Confirm Meat Distribution
          </DialogTitle>
          <DialogDescription>
            Please confirm the meat distribution status for this member.
          </DialogDescription>
        </DialogHeader>

        <Card
          className={`${
            isMarkingTaken
              ? "bg-green-50 border-green-200"
              : "bg-red-50 border-red-200"
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-4">
              {isMarkingTaken ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : (
                <XCircle className="h-8 w-8 text-red-600" />
              )}
              <div>
                <h3 className="font-semibold text-lg">{memberName}</h3>
                <p className="text-sm text-muted-foreground">ID: {memberId}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Year: {year}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>
                  Action:{" "}
                  {isMarkingTaken
                    ? "Mark as meat taken"
                    : "Mark as meat not taken"}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-background border">
                <p className="text-sm font-medium mb-1">
                  {isMarkingTaken
                    ? "Confirming Meat Distribution"
                    : "Removing Meat Distribution"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isMarkingTaken
                    ? `This will mark ${memberName} as having received their Qurbani/Udhiya meat for ${year}.`
                    : `This will mark ${memberName} as NOT having received their Qurbani/Udhiya meat for ${year}.`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            variant={isMarkingTaken ? "default" : "destructive"}
            className="flex items-center gap-2"
          >
            {isMarking ? (
              "Submitting..."
            ) : (
              <>
                {" "}
                {isMarkingTaken ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Mark as Taken
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4" />
                    Mark as Not Taken
                  </>
                )}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
