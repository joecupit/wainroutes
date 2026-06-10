import "@/styles/globals.css";

import type { Metadata, Viewport } from "next";
import Script from "next/script";

import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

export const metadata: Metadata = {
  title: {
    default: "Wainroutes Lake District Walks",
    template: "%s | Wainroutes",
  },
  description:
    "Walk the Wainwrights in the Lake District with detailed routes, mountain forecasts, and travel info.",
};

export const viewport: Viewport = {
  themeColor: "#0d0d0c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <Footer />
        <Script
          src="https://app.rybbit.io/api/script.js"
          data-site-id="77d610f207f8"
          strategy="afterInteractive"
        />
        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id="685a9f09-73f3-4ff2-a1f7-1a5bcedbd473"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
