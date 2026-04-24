"use client";

import Hero from "./_components/section/Hero";
import Features from "./_components/section/Feature";
import Faq from "./_components/section/FAQ";
import ChatPage from "./chat/page";
import { isTauri } from "@tauri-apps/api/core";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDesktop(isTauri());
  }, []);

  // Return an empty background during initial mount to prevent flicker
  if (!mounted) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div>
      {isDesktop ? (
        <>
          <ChatPage />
        </>
      ) : (
        <>
          <Hero />
          <Features />
          <Faq />
          <div className="px-4 py-4 md:py-6">
            <Footer />
          </div>
        </>
      )}
    </div>
  );
}
