import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LaunchKit Web',
  description: 'Frontend demo for the LaunchKit SaaS backend starter.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
