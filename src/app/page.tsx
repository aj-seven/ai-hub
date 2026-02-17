"use client";

import Hero from "./_components/section/Hero";
import Features from "./_components/section/Feature";
import Faq from "./_components/section/FAQ";
import ChatPage from "./chat/page";
import { isTauri } from "@tauri-apps/api/core";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div>
      {isTauri() ? (
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
