import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";

export default function PrivacyTerms() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative px-4 py-10 md:py-14 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
        <div className="relative max-w-7xl mx-auto text-center space-y-3">
          <Badge
            variant="outline"
            className="mb-2 py-1 px-3 backdrop-blur border-primary/20 bg-primary/5 text-primary"
          >
            🔒 Privacy Policy
          </Badge>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent pb-1">
            Privacy Policy
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We are committed to protecting your personal information and your
            right to privacy.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-4 md:py-6 text-foreground">
        <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
          {/* Introduction */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-2">1. Introduction</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Welcome to AI Hub. Your privacy is important to us, and this page
              outlines how we collect, use, and protect your information. By
              using our platform, you agree to the terms and practices described
              below.
            </p>
          </section>

          {/* Data Collection */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-2">
              2. Data Collection & Usage
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              AI Hub does not collect personal information without your consent.
              The platform may collect basic analytics such as usage frequency
              and tool interactions to improve the experience.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                We do <strong>not</strong> store any content you generate.
              </li>
              <li>
                API keys entered are stored only on your browser (client-side).
              </li>
              <li>
                We do not transmit or log your API keys or prompt content on our
                servers.
              </li>
            </ul>
          </section>

          {/* API Key Storage */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-2">3. API Key Storage</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              All API keys provided by users (OpenAI, Claude, Gemini, etc.) are
              stored securely in the browser’s local storage. They are never
              sent to any backend or third-party service.
            </p>
            <p className="mt-2 text-sm">
              Tip: You can clear your browser storage at any time to remove
              keys.
            </p>
          </section>

          {/* Use of AI APIs */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-2">
              4. AI Providers and Usage
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              AI Hub integrates with multiple AI APIs such as OpenAI, Anthropic
              (Claude), Google Gemini, Cohere and Ollama Models. When you use a
              tool, your request is directly sent to the selected provider via
              their secure API.
            </p>
            <p className="text-lg mt-2 font-medium">
              You are responsible for complying with the terms and acceptable
              use policies of the AI provider(s) whose APIs you connect.
            </p>
          </section>

          {/* Terms of Use */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-2">5. Terms of Use</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              By using AI Hub, you agree to the following conditions:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                Do not misuse the service for illegal or harmful content
                generation.
              </li>
              <li>Respect copyright and content ownership laws.</li>
            </ul>
          </section>

          {/* Changes and Contact */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-2">
              6. Changes & Contact
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We may update this page periodically. Continued use of the
              platform means acceptance of any changes.
            </p>
          </section>
        </div>
        <Footer />
      </div>
    </div>
  );
}
