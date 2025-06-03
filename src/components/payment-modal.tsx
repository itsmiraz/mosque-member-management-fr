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
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (selectedMonths: string[], paymentMethod: string) => void
  unpaidMonths: string[]
  year: string
  memberName: string
}

const MONTHLY_FEE = 50

export function PaymentModal({ isOpen, onClose, onSubmit, unpaidMonths, year, memberName }: PaymentModalProps) {
  const [selectedMonths, setSelectedMonths] = useState<string[]>([])
  const [paymentMethod, setPaymentMethod] = useState("")

  const handleMonthToggle = (month: string) => {
    setSelectedMonths((prev) => (prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month]))
  }

  const handleSelectAll = () => {
    setSelectedMonths(unpaidMonths)
  }

  const handleClearAll = () => {
    setSelectedMonths([])
  }

  const totalAmount = selectedMonths.length * MONTHLY_FEE

  const handleSubmit = () => {
    if (selectedMonths.length > 0 && paymentMethod) {
      onSubmit(selectedMonths, paymentMethod)
      setSelectedMonths([])
      setPaymentMethod("")
    }
  }

  const handleClose = () => {
    setSelectedMonths([])
    setPaymentMethod("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Make Payment</DialogTitle>
          <DialogDescription>
            Select months to pay for {memberName} ({year})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Month Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm font-medium">Select Months</Label>
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={handleSelectAll} disabled={unpaidMonths.length === 0}>
                  Select All
                </Button>
                <Button variant="outline" size="sm" onClick={handleClearAll} disabled={selectedMonths.length === 0}>
                  Clear
                </Button>
              </div>
            </div>

            {unpaidMonths.length === 0 ? (
              <Card>
                <CardContent className="p-4 text-center text-muted-foreground">
                  All months are paid for {year}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {unpaidMonths.map((month) => (
                  <div key={month} className="flex items-center space-x-2">
                    <Checkbox
                      id={month}
                      checked={selectedMonths.includes(month)}
                      onCheckedChange={() => handleMonthToggle(month)}
                    />
                    <Label htmlFor={month} className="text-sm cursor-pointer">
                      {month}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Payment Method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="check">Check</SelectItem>
                <SelectItem value="online">Online Payment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payment Summary */}
          {selectedMonths.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Selected Months:</span>
                    <span>{selectedMonths.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Monthly Fee:</span>
                    <span>${MONTHLY_FEE}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>Total Amount:</span>
                    <span>${totalAmount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={selectedMonths.length === 0 || !paymentMethod}>
            Process Payment (${totalAmount})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
