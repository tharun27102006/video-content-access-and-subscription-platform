import type { Metadata } from 'next';
import { Sora, Nunito_Sans } from 'next/font/google';
import './globals.css';

const display = Sora({ subsets: ['latin'], variable: '--font-display' });
const body = Nunito_Sans({ subsets: ['latin'], variable: '--font-body' });

export const metadata: Metadata = {
  title: 'Velvet Video',
  description: 'Pastel video downloads with premium upgrades and Razorpay test checkout.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable}`}>
        <div className="page-shell">{children}</div>
      </body>
    </html>
  );
}
