export default function PrivacyTerms() {
  return (
    <div className="max-w-7xl mx-auto px-3 text-gray-800 dark:text-gray-200">
      <h1 className="text-4xl font-bold mb-4">
        Privacy Policy & Terms of Service
      </h1>

      {/* Introduction */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">1. Introduction</h2>
        <p>
          Welcome to AI Hub. Your privacy is important to us, and this page
          outlines how we collect, use, and protect your information. By using
          our platform, you agree to the terms and practices described below.
        </p>
      </section>

      {/* Data Collection */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">
          2. Data Collection & Usage
        </h2>
        <p>
          AI Hub does not collect personal information without your consent. The
          platform may collect basic analytics such as usage frequency and tool
          interactions to improve the experience.
        </p>
        <ul className="list-disc ml-6 mt-2 space-y-1">
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
        <p>
          All API keys provided by users (OpenAI, Claude, Gemini, etc.) are
          stored securely in the browser’s local storage. They are never sent to
          any backend or third-party service.
        </p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Tip: You can clear your browser storage at any time to remove keys.
        </p>
      </section>

      {/* Use of AI APIs */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">
          4. AI Providers and Usage
        </h2>
        <p>
          AI Hub integrates with multiple AI APIs such as OpenAI, Anthropic
          (Claude), Google Gemini, Cohere and Ollama Models. When you use a
          tool, your request is directly sent to the selected provider via their
          secure API.
        </p>
        <p className="mt-2">
          You are responsible for complying with the terms and acceptable use
          policies of the AI provider(s) whose APIs you connect.
        </p>
      </section>

      {/* Terms of Use */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">5. Terms of Use</h2>
        <p>By using AI Hub, you agree to the following conditions:</p>
        <ul className="list-disc ml-6 mt-2 space-y-1">
          <li>
            Do not misuse the service for illegal or harmful content generation.
          </li>
          <li>Respect copyright and content ownership laws.</li>
          <li>
            We reserve the right to limit or revoke access for abuse or misuse.
          </li>
        </ul>
      </section>

      {/* Changes and Contact */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">6. Changes & Contact</h2>
        <p>
          We may update this page periodically. Continued use of the platform
          means acceptance of any changes.
        </p>
      </section>
    </div>
  );
}
