import {
  Zap,
  CheckCircle,
  Cpu,
  Layers,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Features() {
  const features = [
    {
      icon: <Zap className="h-6 w-6 text-blue-100" />,
      title: "Multiple AI Providers",
      description:
        "Access OpenAI, Claude, Gemini, Cohere, and more from a single unified interface.",
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      icon: <Sparkles className="h-6 w-6 text-amber-100" />,
      title: "Real-time Generation",
      description:
        "Generate high-quality content in real-time with optimized streaming API integrations.",
      gradient: "from-amber-500 to-orange-600",
    },
    {
      icon: <Layers className="h-6 w-6 text-emerald-100" />,
      title: "Seamless Integration",
      description:
        "Effortlessly integrate AI-powered tools into your daily workflow with zero friction.",
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      icon: <Cpu className="h-6 w-6 text-purple-100" />,
      title: "Ollama Model Support",
      description:
        "Run local LLaMA, Mistral, and other models with Ollama for full privacy and control.",
      gradient: "from-purple-500 to-violet-600",
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-rose-100" />,
      title: "Privacy Focused",
      description:
        "Your data stays yours. Local models run entirely on your machine without external API calls.",
      gradient: "from-rose-500 to-red-600",
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-cyan-100" />,
      title: "Smart Templates",
      description:
        "Pre-built templates for emails, blogs, social posts, and more to jumpstart your creation.",
      gradient: "from-cyan-500 to-blue-600",
    },
  ];

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              AI Hub?
            </span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Experience the future of content creation with a suite of powerful,
            privacy-focused, and integrated AI tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group relative border-border/50 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <div
                className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />
              <CardContent className="p-4 md:p-8 flex flex-col items-start h-full">
                <div
                  className={`mb-6 p-3 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg shadow-primary/10 group-hover:scale-110 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
