import { NextResponse } from 'next/server'
import { z } from 'zod'
import { apiLogger } from '@/lib/logger'
import { Client } from 'coinbase-commerce-node'

const ContributionRequest = z.object({
  amount: z.number().min(1).max(10000),
  email: z.string().email().optional(),
  name: z.string().optional(),
  message: z.string().max(500).optional()
})

export async function POST(req: Request) {
  try {
    const json = await req.json().catch(() => ({}))
    const parsed = ContributionRequest.safeParse(json)
    
    if (!parsed.success) {
      apiLogger.warn('Invalid contribution request', { errors: parsed.error.issues })
      return NextResponse.json({ error: 'Invalid contribution data' }, { status: 400 })
    }
    
    const { amount, email } = parsed.data
    
    // Initialize Coinbase Commerce client
    Client.init(process.env.COINBASE_COMMERCE_API_KEY!)
    
    // Create Coinbase Commerce charge
    const charge = await Client.charges.create({
      name: `Allowance Guard Contribution - $${amount}`,
      description: 'Support Allowance Guard development and maintenance',
      local_price: {
        amount: amount.toString(),
        currency: 'USD'
      },
      pricing_type: 'fixed_price',
      metadata: {
        donor_email: email || 'anonymous',
        donor_name: name || 'Anonymous',
        message: message || '',
        source: 'allowance_guard_website'
      },
      redirect_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://allowanceguard.com'}/thank-you`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://allowanceguard.com'}`
    })
    
    apiLogger.info('Contribution charge created', { 
      chargeId: charge.id, 
      amount, 
      donorEmail: email || 'anonymous' 
    })
    
    return NextResponse.json({ 
      ok: true, 
      checkoutUrl: charge.hosted_url,
      chargeId: charge.id
    })
    
  } catch (error) {
    apiLogger.error('Contribution creation failed', { 
      error: error instanceof Error ? error.message : 'Unknown error' 
    })
    return NextResponse.json({ error: 'Contribution creation failed' }, { status: 500 })
  }
}
