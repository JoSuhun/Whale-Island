import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    template: '$s | Whale Island Market',
    default: 'Whale Island Market',
  },
  description: 'Sell & Buy all the things!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-neutral-100 text-neutral-700 max-w-screen-sm mx-auto`}
      >
        {children}
      </body>
    </html>
  );
}

