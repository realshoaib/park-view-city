"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/contexts/auth-context"
import { DashboardHeader } from "@/components/dashboard-header"
import { ConsumerSearch } from "@/components/consumer-search"
import { BillResults } from "@/components/bill-results"
import { useToast } from "@/hooks/use-toast"
import type { Bill } from "@/lib/mock-data"
import { downloadBillAsPDF } from "@/lib/pdf-generator"

export default function DashboardPage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [searchResults, setSearchResults] = useState<Bill[]>([])
  const [searchedConsumerID, setSearchedConsumerID] = useState("")
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth")
    }
  }, [isAuthenticated, loading, router])

  const handleSearchResults = (bills: Bill[], customerId: string) => {
    setSearchResults(bills)
    setSearchedConsumerID(customerId)
    setHasSearched(true)
  }

  // Send email
  const sendBillEmail = async (customerId: string, email: string) => {
    await fetch(`/api/email?customerId=${customerId}&email=${email}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const handleDownload = async (bill: Bill) => {
    try {
      // Show download started toast
      toast({
        title: "Download Started",
        description: `Generating ${bill.description} (${bill.billNumber})`,
      })

      // Use the new PDF generator (now async)
      await downloadBillAsPDF(bill)

      // Show success toast
      toast({
        title: "Download Complete",
        description: `${bill.billNumber}.pdf has been downloaded`,
      })

      const myEmail = 'shoaibkhalil111@gmail.com'
      sendBillEmail(bill.customer_id, myEmail)

    } catch (error) {
      console.error("Download error:", error)
      toast({
        title: "Download Failed",
        description: "There was an error generating the PDF. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect to auth
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-card to-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <DashboardHeader />

        <div className="grid gap-6">
          <ConsumerSearch onSearchResults={handleSearchResults} />

          {hasSearched && (
            <BillResults bills={searchResults} customerId={searchedConsumerID} onDownload={handleDownload} />
          )}
        </div>
      </div>
    </div>
  )
}
