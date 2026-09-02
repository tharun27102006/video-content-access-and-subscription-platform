# Video Platform

A pastel, glassmorphism-style video platform that lets users download videos, track them under a profile Downloads section, and upgrade to premium with Razorpay test checkout.

## Features

- Download videos directly from the site
- Free users can download one video per day
- Premium users can download unlimited videos
- Profile page with a persistent Downloads section
- Razorpay order creation and payment verification routes
- Vercel-ready Next.js App Router setup

## Environment variables

Create a local `.env.local` file with:

```bash
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_test_key_secret
```

## Run locally

```bash
npm install
npm run dev
```

## Deploy on Vercel

Push the repository to GitHub, import it into Vercel, and add the Razorpay test keys in the Vercel project environment settings. The app will remain on test checkout until live keys are provided.

Demo live link
https://video-jaliu26gi-tharun27102006s-projects.vercel.app/
