// WhatsAppService.js - The Automation Engine

export const WhatsAppService = {
  // 1. Initial Greeting & Menu Link
  sendMenuLink: (phone) => {
    const message = `Welcome to Spice Garden! 🌿 Explore our menu and place your order here: https://spicegarden.com/menu`;
    console.log(`[WHATSAPP SENT to ${phone}]: ${message}`);
    // In production, this would be an API call to Meta/Twilio
  },

  // 2. Order Confirmation with ETA
  sendOrderConfirmation: (order) => {
    const eta = order.orderType === "delivery" ? "45-55 mins" : "20-25 mins";
    const message = `✅ Order Confirmed!\n\nHi ${order.customer}, we've received your order #${order.id}.\nTotal: ₹${order.billing.total}\nETA: ${eta}\nTrack here: [Link]`;
    console.log(`[WHATSAPP SENT to ${order.phone}]: ${message}`);
  },

  // 3. Preparation / Dispatch Update
  sendReadyUpdate: (order) => {
    const isDelivery = order.orderType === "delivery";
    const message = isDelivery
      ? `🚀 Out for Delivery!\nHi ${order.customer}, your Spice Garden feast is on its way with our rider.`
      : `🛍️ Ready for Pickup!\nHi ${order.customer}, your order is fresh and ready at the counter.`;
    console.log(`[WHATSAPP SENT to ${order.phone}]: ${message}`);
  },

  // 4. Loyalty & Review Request
  sendLoyaltyClaim: (order) => {
    const message = `Hope you enjoyed your meal, ${order.customer}! 🌿\n\nYou've earned points for this order. Claim them and rate your experience here: [Loyalty Link]`;
    console.log(`[WHATSAPP SENT to ${order.phone}]: ${message}`);
  },
};
