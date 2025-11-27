export default function About() {
  return (
    <>
      <main className="bg-background px-3 py-2">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">About AI Hub</h1>

          <p className="text-lg leading-relaxed mb-6 text-muted-foreground">
            <strong>AI Hub</strong> is a unified workspace for working with the
            world’s most advanced language models — from OpenAI and Claude to
            local Ollama-powered models. Whether you're crafting polished
            emails, writing blog posts, generating tweets, or refining grammar,
            AI Hub brings it all together in one seamless interface.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">
            🚀 What You Can Do
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>
              <strong>Email Generator</strong> – Compose personalized,
              structured emails instantly
            </li>
            <li>
              <strong>Tweet Generator</strong> – Generate engaging and
              viral-ready social posts
            </li>
            <li>
              <strong>Grammar Fixer</strong> – Clean up and improve your writing
              with one click
            </li>
            <li>
              <strong>Prompt Playground</strong> – Experiment across GPT,
              Claude, Gemini, LLaMA, and more
            </li>
            <li>
              <strong>Blog Writer</strong> – Draft long-form, SEO-friendly blog
              content in minutes
            </li>
            <li>
              <strong>Multi-Model Switching</strong> – Easily toggle between
              cloud or local LLMs
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-10 mb-4">
            💡 Why We Built It
          </h2>
          <p className="leading-relaxed text-muted-foreground mb-4">
            We built AI Hub for makers who want flexibility without friction.
            Instead of jumping between services or coding interfaces, AI Hub
            gives you one place to write, explore prompts, and test outputs from
            multiple models — all without writing a single line of code.
          </p>
          <p className="leading-relaxed text-muted-foreground">
            With support for both cloud APIs and offline/local models like
            Ollama, you get total control over your workflow — whether you're
            prototyping, automating writing tasks, or just having fun with AI.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">
            🔐 Privacy & Security
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            Your API keys are stored securely in your browser only — never on
            our servers. You control your data, your inputs, and your outputs.
            We don’t store or track your content.
          </p>

          <div className="mt-12">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} AI Hub. All rights reserved.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
