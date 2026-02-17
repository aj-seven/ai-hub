import { Lightbulb, Zap, Bot, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Tips() {
  const tips = [
    {
      icon: <Lightbulb className="w-5 h-5 text-amber-500" />,
      title: "Crafting Better Inputs",
      items: [
        "Be specific about your requirements and goals",
        "Include relevant context and target audience",
        "Mention desired tone (e.g., professional, casual)",
      ],
      color:
        "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400",
    },
    {
      icon: <Zap className="w-5 h-5 text-blue-500" />,
      title: "Optimizing Results",
      items: [
        "Review and edit the generated content manually",
        "Try different AI providers for varied perspectives",
        "Iterate with follow-up prompts for refinement",
      ],
      color:
        "bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400",
    },
    {
      icon: <Bot className="w-5 h-5 text-purple-500" />,
      title: "Choosing the Right Model",
      items: [
        "OpenAI (GPT-4) is versatile for general tasks",
        "Claude is excellent for nuanced writing & analysis",
        "Gemini shines in creative and multimodal tasks",
      ],
      color:
        "bg-purple-500/10 border-purple-500/20 text-purple-700 dark:text-purple-400",
    },
  ];

  return (
    <section className="mt-6 mb-6 pt-2 border-t border-border/50">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <Lightbulb className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">
          Pro Tips for Best Results
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tips.map((tip, index) => (
          <Card
            key={index}
            className="border-border/50 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300"
          >
            <CardContent className="p-4">
              <div
                className={`w-10 h-10 rounded-xl ${tip.color} flex items-center justify-center mb-4 border`}
              >
                {tip.icon}
              </div>
              <h3 className="font-semibold text-base mb-3">{tip.title}</h3>
              <ul className="space-y-2.5">
                {tip.items.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mt-1 text-primary/60 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
