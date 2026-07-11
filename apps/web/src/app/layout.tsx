import "@v1/ui/globals.css";
import { GitNewsFooter } from "@/components/gitnews-footer";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { Provider as AnalyticsProvider } from "@v1/analytics/client";
import { cn } from "@v1/ui/utils";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Lora } from "next/font/google";

const DepartureMono = localFont({
  src: "../fonts/DepartureMono-Regular.woff2",
  variable: "--font-departure-mono",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gitnews.ai"),
  title: "GitNews — AI-Powered GitHub Intelligence Directory",
  description:
    "Discover trending GitHub repositories, developer tools, machine learning framework launches, and technology news.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          `${DepartureMono.variable} ${GeistSans.variable} ${GeistMono.variable} ${lora.variable}`,
          "antialiased",
        )}
      >
        <ThemeProvider>
          <Navbar />
          {children}
          <GitNewsFooter />
        </ThemeProvider>

        <AnalyticsProvider />
      </body>
    </html>
  );
}
