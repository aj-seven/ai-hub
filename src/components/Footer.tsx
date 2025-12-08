import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="border-t py-4 px-3">
      <div className="max-w-7xl mx-auto">
        {/* Logo + Name */}
        <div className="flex space-x-2 mb-2">
          <div className="rounded-lg">
            <Link href="/" className="flex items-center gap-1">
              <div className="rounded-lg">
                <Image
                  src="/assets/logo-nobg.png"
                  alt="AI Hub Logo"
                  width={42}
                  height={42}
                />
              </div>
              <span className="text-2xl mt-auto font-bold">AI Hub</span>
            </Link>
          </div>
        </div>

        {/* Tagline */}
        <p className="max-w-2xl mb-4">
          AI Hub is your unified platform for creating, chatting, and
          collaborating with advanced AI models like GPT-4, Claude, Gemini via
          API and local LLaMA via Ollama.
        </p>

        {/* Footer Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
          <div>
            <h3 className="font-extrabold mb-2">AI Tools</h3>
            <p>Email Writer</p>
            <p>Tweet Generator</p>
            <p>Grammar Checker</p>
            <p>Sentence Builder</p>
            <p>Text Summarizer</p>
            <p>Content Rewriter</p>
            <p>Blog Generator</p>
            <p>Chat Interface</p>
          </div>

          <div>
            <h3 className="font-extrabold mb-2">AI Providers</h3>
            <p>OpenAI (GPT-4, GPT-3.5)</p>
            <p>Anthropic Claude</p>
            <p>Google Gemini</p>
            <p>Ollama (LLaMA, Mistral, etc.)</p>
          </div>

          <div>
            <h3 className="font-extrabold mb-2">Resources</h3>
            <Link href="/get-started" className="text-blue-600 hover:underline">
              Get Started
            </Link>
            <Link href="/chat" className="text-blue-600 hover:underline block">
              Chat with AI
            </Link>
            <Link href="/tools" className="text-blue-600 hover:underline block">
              Explore Tools
            </Link>
            <Link href="/prompts" className="text-blue-600 hover:underline">
              Prompt Library
            </Link>
          </div>

          <div>
            <h3 className="font-extrabold mb-2">Support</h3>
            <Link href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
            <br />
            <Link
              href="mailto:ajseven@outlook.in"
              className="text-blue-600 hover:underline"
            >
              Contact Support
            </Link>
          </div>

          <div>
            <h3 className="font-extrabold mb-2">Downloads</h3>
            <Link
              href="https://github.com/aj-seven/ai-hub/releases/latest"
              target="_blank"
              className="text-blue-600 hover:underline"
            >
              Desktop App (GitHub)
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-6 pt-3 text-sm text-gray-600 dark:text-gray-400">
          <p>&copy; 2025 AI Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
