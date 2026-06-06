import { NextResponse } from 'next/server';
import crypto from 'node:crypto';

export async function POST(request: Request) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret) {
    return NextResponse.json({ error: 'Razorpay secret is missing.' }, { status: 400 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    razorpay_payment_id?: string;
    razorpay_order_id?: string;
    razorpay_signature?: string;
  };

  if (!body.razorpay_payment_id || !body.razorpay_order_id || !body.razorpay_signature) {
    return NextResponse.json({ error: 'Invalid payment payload.' }, { status: 400 });
  }

  const payload = `${body.razorpay_order_id}|${body.razorpay_payment_id}`;
  const expected = crypto.createHmac('sha256', keySecret).update(payload).digest('hex');

  if (expected !== body.razorpay_signature) {
    return NextResponse.json({ error: 'Signature verification failed.' }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
