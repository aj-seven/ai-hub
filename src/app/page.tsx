"use client";

import Hero from "./_components/section/Hero";
import Features from "./_components/section/Feature";
import Faq from "./_components/section/FAQ";
import Footer from "@/components/Footer";
import ChatPage from "./chat/page";
import { isTauri } from "@tauri-apps/api/core";

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
          <Footer />
        </>
      )}
    </div>
  );
}
