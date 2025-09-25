// Mock data for demonstration - in a real app this would come from a database
export interface Bill {
  id: string
  consumerID: string
  billNumber: string
  issue_date: string
  due_date: string
  amount_due: number
  status: "paid" | "pending" | "overdue"
  pdfUrl: string
  description: string
}

export const mockBills: Bill[] = [
  // HS001 - Admin User's Bills (Multiple properties)
  {
    id: "1",
    consumerID: "HS001",
    billNumber: "BILL-2024-001",
    issue_date: "2024-01-15",
    due_date: "2024-02-15",
    amount_due: 2500,
    status: "paid",
    pdfUrl: "/mock-bills/bill-001.pdf",
    description: "Monthly Maintenance - January 2024",
  },
  {
    id: "2",
    consumerID: "HS001",
    billNumber: "BILL-2024-002",
    issue_date: "2024-02-15",
    due_date: "2024-03-15",
    amount_due: 2500,
    status: "pending",
    pdfUrl: "/mock-bills/bill-002.pdf",
    description: "Monthly Maintenance - February 2024",
  },
  {
    id: "3",
    consumerID: "HS001",
    billNumber: "BILL-2024-003",
    issue_date: "2024-03-15",
    due_date: "2024-04-15",
    amount_due: 2500,
    status: "pending",
    pdfUrl: "/mock-bills/bill-003.pdf",
    description: "Monthly Maintenance - March 2024",
  }
]

export function searchBillsByConsumerID(consumerID: string): Bill[] {
  return mockBills.filter((bill) => bill.consumerID.toLowerCase().includes(consumerID.toLowerCase()))
}

export function getBillById(id: string): Bill | undefined {
  return mockBills.find((bill) => bill.id === id)
}

// Get all available customer IDs
export function getAllConsumerIDs(): string[] {
  const uniqueIDs = [...new Set(mockBills.map(bill => bill.consumerID))]
  return uniqueIDs.sort()
}

// Get bills by status
export function getBillsByStatus(status: Bill["status"]): Bill[] {
  return mockBills.filter(bill => bill.status === status)
}

// Get bills by description type
export function getBillsByDescription(description: string): Bill[] {
  return mockBills.filter(bill => 
    bill.description.toLowerCase().includes(description.toLowerCase())
  )
}

// Get total amount_due for a customer
export function getTotalAmountForConsumer(consumerID: string): number {
  return mockBills
    .filter(bill => bill.consumerID === consumerID)
    .reduce((total, bill) => total + bill.amount_due, 0)
}

// Get bills summary for a customer
export function getBillsSummaryForConsumer(consumerID: string) {
  const consumerBills = mockBills.filter(bill => bill.consumerID === consumerID)
  
  return {
    totalBills: consumerBills.length,
    totalAmount: consumerBills.reduce((sum, bill) => sum + bill.amount_due, 0),
    paidBills: consumerBills.filter(bill => bill.status === "paid").length,
    pendingBills: consumerBills.filter(bill => bill.status === "pending").length,
    overdueBills: consumerBills.filter(bill => bill.status === "overdue").length,
    paidAmount: consumerBills
      .filter(bill => bill.status === "paid")
      .reduce((sum, bill) => sum + bill.amount_due, 0),
    pendingAmount: consumerBills
      .filter(bill => bill.status === "pending")
      .reduce((sum, bill) => sum + bill.amount_due, 0),
    overdueAmount: consumerBills
      .filter(bill => bill.status === "overdue")
      .reduce((sum, bill) => sum + bill.amount_due, 0),
  }
}
