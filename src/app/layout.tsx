import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "next-themes";
import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, // Accessability: allow zooming
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "AI Hub – Chat with AI, Create Instantly",
    template: "%s | AI Hub",
  },
  description:
    "AI Hub lets you chat with powerful AI models like Ollama for real-time assistance, content generation, and productivity tools—all in one place.",
  keywords: [
    "AI",
    "Chatbot",
    "Ollama",
    "GPT-4",
    "Claude",
    "Gemini",
    "Content Generation",
    "Productivity",
    "Writing Assistant",
  ],
  authors: [{ name: "Aj7" }],
  creator: "Aj7",
  publisher: "AI Hub",
  metadataBase: new URL("https://ai-hubx.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ai-hubx.vercel.app",
    title: "AI Hub – Chat with AI, Create Instantly",
    description:
      "Talk to advanced AI models, generate content, brainstorm ideas, and more using AI Hub—your smart assistant for creativity and productivity.",
    siteName: "AI Hub",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI Hub Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Hub – Chat with AI, Create Instantly",
    description:
      "Real-time AI chat powered by Ollama. Create, assist, and innovate using AI Hub’s intelligent tools.",
    images: ["/og-image.png"],
    creator: "@aj7_dev",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  verification: {
    google: "028qjEyCwX-DFd1i4ERqtBsXSHh3FLgAQbdTQx-h4LU",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  appleWebApp: {
    capable: true,
    title: "AI Hub",
    statusBarStyle: "default",
  },
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-background font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Toaster position="top-right" />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
