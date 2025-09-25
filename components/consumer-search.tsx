"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search } from "lucide-react"
import { searchBillsByConsumerID, type Bill } from "@/lib/mock-data"

interface ConsumerSearchProps {
  onSearchResults: (bills: Bill[], consumerID: string) => void
}

export function ConsumerSearch({ onSearchResults }: ConsumerSearchProps) {
  const [consumerID, setConsumerID] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!consumerID.trim()) return

    setLoading(true)

    const bills = await fetchBills(consumerID.trim())
    onSearchResults(bills, consumerID.trim())
    setLoading(false)
  }

  async function fetchBills(customerId: string) {
    const res = await fetch(`/api/bills?customerId=${customerId}`)
    const data = await res.json()
    return data.bills
  }  

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          Search Bills
        </CardTitle>
        <CardDescription>Enter your Customer ID to find and download your bills</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="consumerID">Customer ID</Label>
            <Input
              id="consumerID"
              type="text"
              placeholder="e.g., PV-019617, PV-019618, PV-019619"
              value={consumerID}
              onChange={(e) => setConsumerID(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Your Customer ID can be found on your previous bills or contact the society office
            </p>
            <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded mt-2">
              <strong>Demo Customer IDs:</strong> PV-019617, PV-119815, PV-029519
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                Searching...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Search Bills
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
