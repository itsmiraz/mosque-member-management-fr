"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { User, Phone, MapPin, CreditCard } from "lucide-react";
import { TMember } from "@/redux/feature/members/memberType";

interface UpdateMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (memberData: TMember) => void;
  member: TMember;
}

export function UpdateMemberModal({
  isOpen,
  onClose,
  onSubmit,
  member,
}: UpdateMemberModalProps) {
  const [formData, setFormData] = useState<Partial<TMember>>({
    memberId: "",
    name: "",
    name_in_bengali: "",
    phone: "",
    address: "",
    // membershipStartDate: "",
    status: "active",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof TMember, string>>>(
    {}
  );

  // Update form data when member changes or modal opens
  useEffect(() => {
    if (isOpen && member) {
      setFormData({ ...member });
    }
  }, [isOpen, member]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof TMember, string>> = {};

    if (!formData?.name?.trim()) {
      newErrors.name = "Name is required";
    }

    if (formData.phone && !/^\+?[\d\s\-()]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    // if (formData.membershipStartDate && new Date(formData.membershipStartDate) > new Date()) {
    //   newErrors.membershipStartDate = "Membership start date cannot be in the future"
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const cleanedData = {
        ...formData,
        phone: formData.phone?.trim() || undefined,
        address: formData.address?.trim() || undefined,
        // membershipStartDate: formData.membershipStartDate || undefined,
      };
      onSubmit(cleanedData as TMember);
      handleClose();
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const handleInputChange = (field: keyof TMember, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  //   const getTodayDate = () => {
  //     return new Date().toISOString().split("T")[0]
  //   }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Update Member Details
          </DialogTitle>
          <DialogDescription>
            Update the details for {formData.name}. Required fields are marked
            with an asterisk (*).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                Basic Information
              </h3>

              {/* Member ID (read-only) */}
              <div className="space-y-2">
                <Label htmlFor="id" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Member ID
                </Label>
                <Input
                  id="id"
                  value={formData.memberId}
                  disabled
                  className="bg-muted"
                />
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Full Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter member's full name"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Member Status *
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "Active" | "Inactive") =>
                    handleInputChange("status", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                Contact Information
              </h3>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={formData.phone || ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Address
                </Label>
                <Textarea
                  id="address"
                  value={formData.address || ""}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter full address"
                  rows={3}
                  className="resize-none"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
