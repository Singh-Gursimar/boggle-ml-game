import "./globals.css";
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f9fafb',
};

export const metadata: Metadata = {
  title: "Boggle vs AI | Machine Learning Word Game",
  description: "Play Boggle against an AI opponent powered by machine learning. Choose your difficulty and challenge yourself in this minimalist word-finding game.",
  keywords: ["boggle", "word game", "ai", "machine learning", "puzzle"],
  authors: [{ name: "Boggle ML Game" }],
  openGraph: {
    title: "Boggle vs AI",
    description: "Challenge an AI opponent in this machine learning-powered Boggle game",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}