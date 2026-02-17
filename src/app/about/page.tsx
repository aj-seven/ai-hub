import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Mail,
  PenTool,
  Sparkles,
  MessageSquare,
  Globe,
  Cpu,
  Lock,
  Zap,
} from "lucide-react";

export default function About() {
  const features = [
    {
      title: "Email Generator",
      description:
        "Compose personalized, structured emails instantly for any occasion.",
      icon: <Mail className="w-5 h-5" />,
    },
    {
      title: "Tweet Generator",
      description: "Generate engaging and viral-ready social posts in seconds.",
      icon: <MessageSquare className="w-5 h-5" />,
    },
    {
      title: "Grammar Fixer",
      description: "Clean up and improve your writing with one click.",
      icon: <PenTool className="w-5 h-5" />,
    },
    {
      title: "Prompt Playground",
      description: "Experiment across GPT, Claude, Gemini, LLaMA, and more.",
      icon: <Sparkles className="w-5 h-5" />,
    },
    {
      title: "Blog Writer",
      description: "Draft long-form, SEO-friendly blog content in minutes.",
      icon: <Globe className="w-5 h-5" />,
    },
    {
      title: "Multi-Model Switching",
      description: "Easily toggle between cloud or local LLMs like Ollama.",
      icon: <Cpu className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative px-4 py-12 md:py-20 overflow-hidden text-center">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />

        <div className="relative max-w-4xl mx-auto space-y-4">
          <Badge
            variant="outline"
            className="py-1 px-3 backdrop-blur border-primary/20 bg-primary/5 text-primary"
          >
            👋 About AI Hub
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
            Your Unified AI Workspace
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A single interface for the world's most advanced language models.
            Write, create, and experiment without the friction.
          </p>
        </div>
      </section>

      {/* Mission / Context */}
      <section className="px-4 py-8 md:py-12 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Why We Built It</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We built AI Hub for makers who want flexibility without friction.
            Instead of jumping between services or coding interfaces, AI Hub
            gives you one place to write, explore prompts, and test outputs from
            multiple models — all without writing a single line of code.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mt-8">
            <div className="p-4 bg-background rounded-xl border border-border/50 shadow-sm">
              <div className="flex items-center gap-2 mb-2 font-semibold">
                <Zap className="w-5 h-5 text-amber-500" />
                <span>Frictionless Workflow</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Switch between tasks and models instantly without breaking your
                flow.
              </p>
            </div>
            <div className="p-4 bg-background rounded-xl border border-border/50 shadow-sm">
              <div className="flex items-center gap-2 mb-2 font-semibold">
                <Lock className="w-5 h-5 text-emerald-500" />
                <span>Privacy First</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your API keys are stored locally in your browser. We never see
                your data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 py-4 md:py-6">
        <div className="max-w-7xl mx-auto mb-4">
          <div className="text-center mb-12 space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              What You Can Do
            </h2>
            <p className="text-muted-foreground">
              Powerful tools for every writing task
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur-sm"
              >
                <CardHeader>
                  <div className="inline-flex p-4 rounded-lg bg-primary/5 text-primary group-hover:bg-primary/10 transition-colors">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <Footer />
      </section>
    </div>
  );
}
