import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Faq() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Get answers to frequently asked questions about AI Hub.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="q1">
            <AccordionTrigger>What is AI Hub?</AccordionTrigger>
            <AccordionContent>
              AI Hub is an all-in-one platform that connects you with powerful
              AI models — including OpenAI, Claude, Gemini, Cohere, and locally
              hosted Ollama models — to help you write smarter and create
              faster.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q2">
            <AccordionTrigger>Which AI models are supported?</AccordionTrigger>
            <AccordionContent>
              AI Hub supports top-tier models from OpenAI, Anthropic (Claude),
              Google Gemini, Cohere, and Ollama for running models locally. You
              can easily switch between them based on your needs.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q3">
            <AccordionTrigger>
              Do I need coding skills to use AI Hub?
            </AccordionTrigger>
            <AccordionContent>
              No coding is required. Simply provide your API keys from supported
              providers. If you're using Ollama, you’ll just need to install it
              and ensure it’s running on your local machine.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q4">
            <AccordionTrigger>Is my API key stored securely?</AccordionTrigger>
            <AccordionContent>
              Yes — your API keys are stored only in your browser's local
              storage. They never leave your device or get sent to any external
              server.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q5">
            <AccordionTrigger>Is AI Hub free to use?</AccordionTrigger>
            <AccordionContent>
              Yes, AI Hub is free to use. You only need valid API keys from
              supported AI providers, most of which offer free tiers or trial
              credits.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
