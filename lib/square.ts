const {
  randomUUID,
} = require('node:crypto');

const API = 'https://connect.squareupsandbox.com/v2';

const headers = new Headers({
  'Square-Version': '2025-10-16',
  'Authorization': 'Bearer {ACCESS_TOKEN}',
  'Content-Type': 'application/json'
});

export async function createPaymentLink (amount: number, location_id: string) {
  let checkout: string | undefined;

  const body = JSON.stringify({
    idempotency_key: new randomUUID(),
    quick_pay: {
      name: 'Therapy session',
      amount_money: {
        amount,
        currency: "GBP"
      },
      location_id
    }
  });

  try {
    const request = await fetch(`${API}/online-checkout/payment-links`, {
      method: 'POST',
      headers,
      body
    });

    if (!request) throw new Error('Customer not connected');

    const { error, payment_link } = await request.json();

    if (error) throw new Error(error.detail);

    checkout = payment_link.long_url;
  } catch (e) {
    console.error(e);
  }

  return checkout;
}
