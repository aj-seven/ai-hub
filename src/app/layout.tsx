import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="author" content="Aj7" />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />

        <title>AI Hub – Chat with AI, Create Instantly</title>

        <meta
          name="description"
          content="AI Hub lets you chat with powerful AI models like Ollama for real-time assistance, content generation, and productivity tools—all in one place."
        />

        {/* Open Graph Meta */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="AI Hub – Chat with AI, Create Instantly"
        />
        <meta
          property="og:description"
          content="Talk to advanced AI models, generate content, brainstorm ideas, and more using AI Hub—your smart assistant for creativity and productivity."
        />
        <meta property="og:url" content="https://ai-hubx.vercel.app" />
        <meta
          property="og:image"
          content="https://ai-hubx.vercel.app/og-image.png"
        />

        {/* Twitter Card Meta */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="AI Hub – Chat with AI, Create Instantly"
        />
        <meta
          name="twitter:description"
          content="Real-time AI chat powered by Ollama. Create, assist, and innovate using AI Hub’s intelligent tools."
        />
        <meta
          name="twitter:image"
          content="https://ai-hubx.vercel.app/og-image.png"
        />
        <meta name="twitter:creator" content="@your_twitter_handle" />

        {/* Viewport and Icons */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=3.0, minimum-scale=1.0, user-scalable=yes"
        />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>

      <body>
        <ThemeProvider attribute="class" defaultTheme="light">
          <Navbar />
          {children}
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
