"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { User, Phone, MapPin, Calendar, CreditCard } from "lucide-react"

interface AddMemberModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (memberData: NewMemberData) => void
}

export interface NewMemberData {
  name: string
  phone?: string
  address?: string
  membershipStartDate?: string
  status: "Active" | "Inactive"
}

export function AddMemberModal({ isOpen, onClose, onSubmit }: AddMemberModalProps) {
  const [formData, setFormData] = useState<NewMemberData>({
    name: "",
    phone: "",
    address: "",
    membershipStartDate: "",
    status: "Active",
  })

  const [errors, setErrors] = useState<Partial<Record<keyof NewMemberData, string>>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof NewMemberData, string>> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (formData.phone && !/^\+?[\d\s\-$$$$]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number"
    }

    if (formData.membershipStartDate && new Date(formData.membershipStartDate) > new Date()) {
      newErrors.membershipStartDate = "Membership start date cannot be in the future"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      const cleanedData = {
        ...formData,
        phone: formData.phone?.trim() || undefined,
        address: formData.address?.trim() || undefined,
        membershipStartDate: formData.membershipStartDate || undefined,
      }
      onSubmit(cleanedData)
      handleClose()
    }
  }

  const handleClose = () => {
    setFormData({
      name: "",
      phone: "",
      address: "",
      membershipStartDate: "",
      status: "Active",
    })
    setErrors({})
    onClose()
  }

  const handleInputChange = (field: keyof NewMemberData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0]
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Add New Member
          </DialogTitle>
          <DialogDescription>
            Enter the details for the new member. Required fields are marked with an asterisk (*).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Basic Information</h3>

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
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Member Status *
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "Active" | "Inactive") => handleInputChange("status", value)}
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
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Contact Information</h3>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Address
                </Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter full address"
                  rows={3}
                  className="resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Membership Information */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                Membership Information
              </h3>

              {/* Membership Start Date */}
              <div className="space-y-2">
                <Label htmlFor="membershipStartDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Membership Start Date
                </Label>
                <Input
                  id="membershipStartDate"
                  type="date"
                  value={formData.membershipStartDate}
                  onChange={(e) => handleInputChange("membershipStartDate", e.target.value)}
                  max={getTodayDate()}
                  className={errors.membershipStartDate ? "border-red-500" : ""}
                />
                {errors.membershipStartDate && <p className="text-sm text-red-500">{errors.membershipStartDate}</p>}
                <p className="text-xs text-muted-foreground">Leave empty if starting today</p>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <h3 className="font-medium text-sm mb-3">Member Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">{formData.name || "Not specified"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium">{formData.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="font-medium">{formData.phone || "Not provided"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Start Date:</span>
                  <span className="font-medium">
                    {formData.membershipStartDate
                      ? new Date(formData.membershipStartDate).toLocaleDateString()
                      : "Today"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!formData.name.trim()}>
            Add Member
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
