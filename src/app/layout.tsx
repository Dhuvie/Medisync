import type { Metadata } from "next";
import { Bangers, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const bangers = Bangers({
  variable: "--font-bangers",
  subsets: ["latin"],
  weight: "400",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MediSync — AI Clinical Decision Support",
  description:
    "MediSync: AI-powered intelligent clinical triage & decision support platform. Explainable differential diagnosis, risk scoring, and evidence-based recommendations.",
  keywords: ["MediSync", "Clinical Decision Support", "CDSS", "AI Triage", "Differential Diagnosis", "Healthcare AI"],
  authors: [{ name: "MediSync Team" }],
  icons: { icon: "/logo.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${bangers.variable} ${jetbrains.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <SonnerToaster richColors position="top-right" />
      </body>
    </html>
  );
}
