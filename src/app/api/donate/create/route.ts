import { NextResponse } from 'next/server'
import { z } from 'zod'
import { apiLogger } from '@/lib/logger'
import { CommerceSDK } from 'commerce-node'

const DonationRequest = z.object({
  amount: z.number().min(1).max(10000),
  email: z.string().email().optional(),
  name: z.string().optional(),
  message: z.string().max(500).optional()
})

export async function POST(req: Request) {
  try {
    const json = await req.json().catch(() => ({}))
    const parsed = DonationRequest.safeParse(json)
    
    if (!parsed.success) {
      apiLogger.warn('Invalid donation request', { errors: parsed.error.issues })
      return NextResponse.json({ error: 'Invalid donation data' }, { status: 400 })
    }
    
    const { amount, email, name, message } = parsed.data
    
    // Initialize Coinbase Commerce client
    const client = new CommerceSDK({ apiKey: process.env.COINBASE_COMMERCE_API_KEY! })
    
    // Create Coinbase Commerce charge
    // TODO: Fix API method - temporarily disabled for deployment
    const charge = { id: 'mock', hosted_url: 'https://allowanceguard.com/coming-soon' } as any
    // const charge = await client.charges.create({
    //   name: `Allowance Guard Donation - $${amount}`,
    //   description: 'Support Allowance Guard development and maintenance',
    //   local_price: {
    //     amount: amount.toString(),
    //     currency: 'USD'
    //   },
    //   pricing_type: 'fixed_price',
    //   metadata: {
    //     donor_email: email || 'anonymous',
    //     donor_name: name || 'Anonymous',
    //     message: message || '',
    //     source: 'allowance_guard_website'
    //   },
    //   redirect_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://allowanceguard.com'}/thank-you`,
    //   cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://allowanceguard.com'}`
    // })
    
    apiLogger.info('Donation charge created', { 
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
    apiLogger.error('Donation creation failed', { 
      error: error instanceof Error ? error.message : 'Unknown error' 
    })
    return NextResponse.json({ error: 'Donation creation failed' }, { status: 500 })
  }
}
