import { NextResponse } from 'next/server';

const amountByPlan: Record<string, number> = {
  premium: 90000
};

export async function POST(request: Request) {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return NextResponse.json({ error: 'Razorpay test keys are missing.' }, { status: 400 });
  }

  const { plan } = (await request.json().catch(() => ({}))) as { plan?: string };
  const amount = amountByPlan[plan ?? 'premium'];

  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        plan: plan ?? 'premium'
      }
    })
  });

  if (!response.ok) {
    return NextResponse.json({ error: 'Unable to create Razorpay order.' }, { status: 500 });
  }

  const order = (await response.json()) as { id: string; amount: number; currency: string };

  return NextResponse.json({
    keyId,
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    name: 'Velvet Video'
  });
}
