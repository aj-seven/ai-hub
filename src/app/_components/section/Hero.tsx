import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  return (
    <section className="mt-4 px-3 py-12">
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Text Section */}
        <div className="w-full flex flex-col justify-center items-center">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
            Your AI Hub for <br />
            <span className="underline text-blue-500 underline-offset-8">
              Chat & Content Creation
            </span>
          </h1>

          <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-2xl">
            Chat with powerful models like Ollama models, or generate content
            with smart AI tools — all in one place. Emails, blogs, tweets, and
            more made easy.
          </p>

          {/* CTA Buttons */}
          <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="relative inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl px-6 py-3 text-lg font-bold transition duration-300 ease-in-out transform hover:scale-105 shadow-lg group"
              onClick={() => router.push("/get-started")}
            >
              Get Started
              <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
            </Button>

            <span className="text-gray-500 dark:text-gray-400 animate-pulse flex items-center">
              (or)
            </span>

            <Button
              size="lg"
              className="px-6 py-3 text-lg rounded-xl font-bold shadow-lg transition duration-200 hover:scale-105 group"
              onClick={() => router.push("/chat")}
            >
              Chat with AI
              <MessageCircle className="h-6 w-6 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          {/* Desktop App */}
          <p className="mt-6 text-sm sm:text-base md:text-lg">
            Available for macOS, Windows, and Linux —{" "}
            <a
              href="https://github.com/aj-seven/ai-hub/releases/latest"
              target="_blank"
              className="text-blue-600 dark:text-blue-400 underline hover:opacity-80"
            >
              Download the App
            </a>
          </p>
        </div>

        {/* Image Section */}
        <div className="w-full mt-8 flex justify-center group transition-shadow duration-300 hover:shadow-xl">
          <Image
            src="/assets/hero-image.png"
            alt="AI Hub Illustration"
            width={900}
            height={900}
            className="object-contain rounded-xl border transform transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-2 group-hover:translate-x-2"
            priority={false}
          />
        </div>
      </div>
    </section>
  );
}
