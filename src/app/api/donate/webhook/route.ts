import { NextResponse } from 'next/server'
import { apiLogger } from '@/lib/logger'
import { sendThankYouEmail } from '@/lib/mailer'
import { WebhooksService } from 'coinbase-commerce-node'

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const signature = req.headers.get('x-cc-webhook-signature')
    
    if (!signature) {
      apiLogger.warn('Missing webhook signature')
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }
    
    // Verify webhook signature
    const webhooksService = new WebhooksService()
    const event = webhooksService.verifyEventBody(
      body,
      signature,
      process.env.COINBASE_COMMERCE_WEBHOOK_SECRET!
    )
    
    if (event.type === 'charge:confirmed') {
      const charge = event.data
      const metadata = charge.metadata
      
      apiLogger.info('Contribution confirmed', {
        chargeId: charge.id,
        amount: charge.pricing.local.amount,
        currency: charge.pricing.local.currency,
        donorEmail: metadata.donor_email
      })
      
      // Send thank you email if donor provided email
      if (metadata.donor_email && metadata.donor_email !== 'anonymous') {
        try {
          await sendThankYouEmail({
            to: metadata.donor_email,
            donorName: metadata.donor_name || 'Friend',
            amount: charge.pricing.local.amount,
            currency: charge.pricing.local.currency
          })
          apiLogger.info('Thank you email sent', { email: metadata.donor_email })
        } catch (emailError) {
          apiLogger.error('Failed to send thank you email', { 
            error: emailError instanceof Error ? emailError.message : 'Unknown error',
            email: metadata.donor_email 
          })
        }
      }
    }
    
    return NextResponse.json({ ok: true })
    
  } catch (error) {
    apiLogger.error('Webhook processing failed', { 
      error: error instanceof Error ? error.message : 'Unknown error' 
    })
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
