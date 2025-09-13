// src/app/api/create-checkout-session/route.ts (App Router)
import Stripe from 'stripe'
import { NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
})

export async function POST(req: Request) {
  try {
    const { amount } = await req.json()

    // Validate donation amount
    if (!amount || isNaN(amount) || amount < 100) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Donation to Allowance Guard',
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/thank-you`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/donate`,
    })

    return NextResponse.json({ id: session.id })
  } catch (err) {
    console.error('Stripe Checkout Error:', err)
    const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
