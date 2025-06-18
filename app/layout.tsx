import "./globals.css";

import type { Metadata } from "next";
import localFont from "next/font/local";

import { SupabaseProvider } from '@/components/providers/SupabaseProvider'

import { ZipyAnalytics } from '@/components/analytics/ZipyAnalytics'
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script";
import { env } from '@/lib/env';

import { pageMetadata } from "@/constants/metadata";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = pageMetadata.dashboard;



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="relative">
      <head>
        {/* Plausible Analytics Script */}
        <Script
          defer
          data-domain="thinktapflow.vercel.app"
          src="https://plausible.io/js/script.file-downloads.hash.outbound-links.pageview-props.revenue.tagged-events.js"
        />
        <Script id="plausible-init">
          {`window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }`}
        </Script>

        {/* Umami Cloud Tracking */}
        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id={env.analytics.umamiId}
          strategy="afterInteractive"
          defer
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#EAEEFE]`}
      >
        <SupabaseProvider>
          {children}
          {/* Vercel Analytics */}
          <Analytics />
          {/* Zipy Analytics*/}
          <ZipyAnalytics id={env.analytics.zipyId} />
        </SupabaseProvider>
      </body>
    </html>
  );
}
