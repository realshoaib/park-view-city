"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, Calendar, DollarSign } from "lucide-react"
import type { Bill } from "@/lib/mock-data"

interface BillResultsProps {
  bills: Bill[]
  customerId: string
  onDownload: (bill: Bill) => void
}

export function BillResults({ bills, customerId, onDownload }: BillResultsProps) {
  if (bills.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Bills Found</h3>
          <p className="text-muted-foreground">
            No bills were found for Customer ID: <strong>{customerId}</strong>
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Please check your Customer ID or contact the society office for assistance.
          </p>
        </CardContent>
      </Card>
    )
  }

  const getStatusColor = (status: Bill["status"]) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "overdue":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Bills for Customer ID: {customerId}</h3>
        <Badge variant="secondary">
          {bills.length} bill{bills.length !== 1 ? "s" : ""} found
        </Badge>
      </div>

      <div className="grid gap-4">
        {bills.map((bill) => (
          <Card key={bill.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{bill.description}</CardTitle>
                  <CardDescription>Bill #: {bill.id}</CardDescription>
                </div>
                <Badge className={getStatusColor(bill.status)}>
                  {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Bill Date:</span>
                  <span>{new Date(bill.issue_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Due Date:</span>
                  <span>{new Date(bill.due_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-semibold">₹{bill.amount_due.toLocaleString()}</span>
                </div>
              </div>

              <Button
                onClick={() => onDownload(bill)}
                className="w-full"
                variant={bill.status === "paid" ? "default" : "secondary"}
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
