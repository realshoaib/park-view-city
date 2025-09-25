import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcrypt'

export async function POST(req: Request) {

  try {
    const { action, full_name, email, password, phone_number, address, customer_id, contract_number } = await req.json()

    if (!action || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (action === 'signup') {
      // 1. Check if user exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle()

      if (existingUser) {
        return NextResponse.json({ error: 'User already exists' }, { status: 400 })
      }

      // 2. Hash password
      const hash = await bcrypt.hash(password, 10)

      // 3. Insert user
      const { error } = await supabase.from('users').insert({
        customer_id,
        contract_number,
        full_name,
        email,
        password_hash: hash,
        phone_number,
        address,
      })

      if (error) throw error

      return NextResponse.json({ success: true })
    }

    if (action === 'signin') {
      // 1. Find user
      const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle()

      if (!user) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }

      // 2. Compare password
      const match = await bcrypt.compare(password, user.password_hash)
      if (!match) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }

      // ⚡ For demo: just return user info (in production → JWT/session)
      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          customer_id: user.customer_id,
        },
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: 'Server error', details: err.message }, { status: 500 })
  }
}
