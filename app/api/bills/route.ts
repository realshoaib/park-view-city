import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase" // server-only client

// GET /api/bills?customerId=PV-019617
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const customerId = searchParams.get("customerId")

    if (!customerId) {
      return NextResponse.json({ error: "customerId is required" }, { status: 400 })
    }

    const { data: bills, error } = await supabase
      .from("bills")
      .select("*")
      .eq("customer_id", customerId)
      .order("issue_date", { ascending: false })

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to fetch bills" }, { status: 500 })
    }

    if (!bills || bills.length === 0) {
      return NextResponse.json({ message: "No bills found" }, { status: 404 })
    }

    return NextResponse.json({ bills })
  } catch (err: any) {
    console.error("Unexpected error:", err)
    return NextResponse.json({ error: "Internal server error", details: err.message }, { status: 500 })
  }
}