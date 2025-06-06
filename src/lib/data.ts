export interface Member {
  id: string
  name: string
  phone?: string
  address?: string
  membershipStartDate?: string
  status: "Active" | "Inactive"
}

export interface Payment {
  memberId: string
  year: number
  month: number
  date: string
  method: string
}

// Mock data
export const members: Member[] = [
  {
    id: "M001",
    name: "Ahmed Hassan",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, Springfield, IL 62701",
    membershipStartDate: "2023-01-15",
    status: "Active",
  },
  {
    id: "M002",
    name: "Fatima Al-Zahra",
    phone: "+1 (555) 234-5678",
    address: "456 Oak Ave, Springfield, IL 62702",
    membershipStartDate: "2023-03-10",
    status: "Active",
  },
  {
    id: "M003",
    name: "Omar Abdullah",
    phone: "+1 (555) 345-6789",
    address: "789 Pine St, Springfield, IL 62703",
    membershipStartDate: "2022-11-20",
    status: "Active",
  },
  {
    id: "M004",
    name: "Aisha Rahman",
    phone: "+1 (555) 456-7890",
    address: "321 Elm St, Springfield, IL 62704",
    membershipStartDate: "2023-05-05",
    status: "Inactive",
  },
  {
    id: "M005",
    name: "Muhammad Ali",
    phone: "+1 (555) 567-8901",
    address: "654 Maple Dr, Springfield, IL 62705",
    membershipStartDate: "2023-02-28",
    status: "Active",
  },
  {
    id: "M006",
    name: "Khadija Bint Khuwaylid",
    phone: "+1 (555) 678-9012",
    address: "987 Cedar Ln, Springfield, IL 62706",
    membershipStartDate: "2022-12-15",
    status: "Active",
  },
  {
    id: "M007",
    name: "Ali Ibn Abi Talib",
    phone: "+1 (555) 789-0123",
    address: "147 Birch Rd, Springfield, IL 62707",
    membershipStartDate: "2023-04-12",
    status: "Active",
  },
  {
    id: "M008",
    name: "Zainab Al-Kubra",
    phone: "+1 (555) 890-1234",
    address: "258 Willow Way, Springfield, IL 62708",
    membershipStartDate: "2023-06-18",
    status: "Active",
  },
]

// Payment records
export let payments: Payment[] = [
  // Ahmed Hassan (M001) - paid Jan-Mar 2024
  { memberId: "M001", year: 2024, month: 1, date: "2024-01-05", method: "bank_transfer" },
  { memberId: "M001", year: 2024, month: 2, date: "2024-02-03", method: "bank_transfer" },
  { memberId: "M001", year: 2024, month: 3, date: "2024-03-02", method: "cash" },

  // Fatima Al-Zahra (M002) - paid Jan-May 2024
  { memberId: "M002", year: 2024, month: 1, date: "2024-01-10", method: "online" },
  { memberId: "M002", year: 2024, month: 2, date: "2024-02-08", method: "online" },
  { memberId: "M002", year: 2024, month: 3, date: "2024-03-07", method: "online" },
  { memberId: "M002", year: 2024, month: 4, date: "2024-04-05", method: "online" },
  { memberId: "M002", year: 2024, month: 5, date: "2024-05-03", method: "online" },

  // Omar Abdullah (M003) - paid all of 2024
  ...Array.from({ length: 12 }, (_, i) => ({
    memberId: "M003",
    year: 2024,
    month: i + 1,
    date: `2024-${String(i + 1).padStart(2, "0")}-01`,
    method: "bank_transfer",
  })),

  // Muhammad Ali (M005) - paid Jan-Feb 2024
  { memberId: "M005", year: 2024, month: 1, date: "2024-01-15", method: "cash" },
  { memberId: "M005", year: 2024, month: 2, date: "2024-02-12", method: "cash" },
]

// Meat taken records
export const meatTaken: Record<string, Record<string, boolean>> = {
  M001: { "2024": true },
  M002: { "2024": false },
  M003: { "2024": true },
  M005: { "2024": false },
}

// const MONTHLY_FEE = 50

export function getMemberById(id: string): Member | undefined {
  return members.find((member) => member.id === id)
}

export function getPaymentStatus(memberId: string, year: number, month: number) {
  const payment = payments.find((p) => p.memberId === memberId && p.year === year && p.month === month)

  return {
    paid: !!payment,
    date: payment?.date,
    method: payment?.method,
  }
}

// export function getLastPaymentMonth(memberId: string): string | null {
//   const memberPayments = payments
//     .filter((p) => p.memberId === memberId)
//     .sort((a, b) => {
//       if (a.year !== b.year) return b.year - a.year
//       return b.month - a.month
//     })

//   if (memberPayments.length === 0) return null

//   const lastPayment = memberPayments[0]
//   const monthNames = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ]

//   return `${monthNames[lastPayment.month - 1]} ${lastPayment.year}`
// }

// export function getTotalDue(memberId: string): number {
//   const currentYear = new Date().getFullYear()
//   const currentMonth = new Date().getMonth() + 1

//   let unpaidMonths = 0

//   // Count unpaid months for current year up to current month
//   for (let month = 1; month <= currentMonth; month++) {
//     const status = getPaymentStatus(memberId, currentYear, month)
//     if (!status.paid) {
//       unpaidMonths++
//     }
//   }

//   // Count unpaid months for previous year
//   for (let month = 1; month <= 12; month++) {
//     const status = getPaymentStatus(memberId, currentYear - 1, month)
//     if (!status.paid) {
//       unpaidMonths++
//     }
//   }

//   return unpaidMonths * MONTHLY_FEE
// }

export function updatePayments(memberId: string, year: number, selectedMonths: string[], paymentMethod: string) {
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

  const today = new Date().toISOString().split("T")[0]

  selectedMonths.forEach((monthName) => {
    const monthIndex = monthNames.indexOf(monthName) + 1

    // Remove existing payment if any
    payments = payments.filter((p) => !(p.memberId === memberId && p.year === year && p.month === monthIndex))

    // Add new payment
    payments.push({
      memberId,
      year,
      month: monthIndex,
      date: today,
      method: paymentMethod,
    })
  })
}

export function toggleMeatTaken(memberId: string, year: string) {
  if (!meatTaken[memberId]) {
    meatTaken[memberId] = {}
  }

  meatTaken[memberId][year] = !meatTaken[memberId][year]
}
