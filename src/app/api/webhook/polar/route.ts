import { Webhooks } from "@polar-sh/nextjs";

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
  onPayload: async (payload) => {
    console.log("Received Polar webhook:", payload.type);
    
    // Handle different webhook events
    switch (payload.type) {
      case "subscription.created":
        console.log("New subscription created:", payload.data);
        // TODO: Update user's subscription status in your database
        break;
        
      case "subscription.updated":
        console.log("Subscription updated:", payload.data);
        // TODO: Update subscription details in your database
        break;
        
      case "subscription.canceled":
        console.log("Subscription canceled:", payload.data);
        // TODO: Handle subscription cancellation
        break;
        
      case "order.created":
        console.log("New order created:", payload.data);
        // TODO: Process the order
        break;
        
      case "customer.created":
        console.log("New customer created:", payload.data);
        // TODO: Create customer record in your database
        break;
        
      default:
        console.log("Unhandled webhook type:", payload.type);
    }
  },
});
