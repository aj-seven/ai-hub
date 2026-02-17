import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Faq() {
  const faqs = [
    {
      id: "q1",
      question: "What is AI Hub?",
      answer:
        "AI Hub is an all-in-one platform that connects you with powerful AI models — including OpenAI, Claude, Gemini, Cohere, and locally hosted Ollama models — to help you write smarter and create faster.",
    },
    {
      id: "q2",
      question: "Which AI models are supported?",
      answer:
        "AI Hub supports top-tier models from OpenAI, Anthropic (Claude), Google Gemini, Cohere, and Ollama for running models locally. You can easily switch between them based on your needs.",
    },
    {
      id: "q3",
      question: "Do I need coding skills to use AI Hub?",
      answer:
        "No coding is required. Simply provide your API keys from supported providers. If you're using Ollama, you’ll just need to install it and ensure it’s running on your local machine.",
    },
    {
      id: "q4",
      question: "Is my API key stored securely?",
      answer:
        "Yes — your API keys are stored only in your browser's local storage or encrypted in the desktop app. They never leave your device or get sent to any external server.",
    },
    {
      id: "q5",
      question: "Is AI Hub free to use?",
      answer:
        "Yes, AI Hub is free to use. You only need valid API keys from supported AI providers, most of which offer free tiers or trial credits. Local models via Ollama are completely free.",
    },
  ];

  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get answers to frequently asked questions about AI Hub features,
            security, and pricing.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              className="border border-border/50 bg-card/50 px-6 rounded-xl data-[state=open]:bg-card/80 transition-all duration-200"
            >
              <AccordionTrigger className="text-lg font-medium hover:no-underline py-6 cursor-pointer">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-6 text-base">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
