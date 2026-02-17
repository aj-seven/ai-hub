import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default function Hero() {
  const router = useRouter();

  return (
    <section className="relative px-4 py-12 md:py-20 overflow-hidden">
      {/* Background Grids */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />

      <div className="relative max-w-7xl mx-auto flex flex-col items-center text-center space-y-8">
        {/* Text Section */}
        <div className="w-full flex flex-col justify-center items-center space-y-6 max-w-4xl">
          <Badge
            variant="outline"
            className="py-1.5 px-4 backdrop-blur border-primary/20 bg-primary/5 text-primary rounded-full flex items-center gap-2 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span className="font-medium">The Ultimate AI Workstation</span>
          </Badge>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
            Your AI Hub for <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Chat & Creation
            </span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed">
            Chat with powerful models like Ollama, or generate content with
            smart AI tools — all in one place. Emails, blogs, tweets, and more
            made easy.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap justify-center items-center gap-4 sm:gap-4">
            <Button
              size="lg"
              className="relative cursor-pointer inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl px-8 py-6 text-lg font-bold transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-blue-500/40 group"
              onClick={() => router.push("/get-started")}
            >
              Get Started
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>

            <span className="text-muted-foreground/60 font-medium animate-pulse flex items-center text-sm uppercase tracking-widest">
              (or)
            </span>

            <Button
              size="lg"
              className="px-8 py-6 cursor-pointer text-lg rounded-xl font-bold shadow-lg bg-card border border-border/50 hover:bg-muted/50 text-foreground transition-all duration-200 hover:scale-105 hover:shadow-xl group"
              variant="secondary"
              onClick={() => router.push("/chat")}
            >
              Chat with AI
              <MessageCircle className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          {/* Download Link */}
          <div className="pt-8 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Available for macOS, Windows, and Linux —{" "}
            <a
              href="https://github.com/aj-seven/ai-hub/releases/latest"
              target="_blank"
              className="font-medium text-primary hover:underline hover:text-primary/80 transition-colors"
            >
              Download App
            </a>
          </div>
        </div>

        {/* Image Section */}
        <div className="w-full mt-12 relative group max-w-5xl">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
          <div className="relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl overflow-hidden aspect-[16/9] flex items-center justify-center">
            <Image
              src="/assets/hero-image.png"
              alt="AI Hub Interface"
              width={1200}
              height={675}
              className="object-cover w-full h-full transform transition-transform duration-700 group-hover:scale-[1.02]"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
