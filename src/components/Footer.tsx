import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Github, Mail, Linkedin, Twitter, X } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border/90 bg-background/50 backdrop-blur-sm pt-2">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-12">
          {/* Brand Section (4 cols) */}
          <div className="lg:col-span-4 space-y-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-10 h-10 overflow-hidden rounded-xl border border-border/50 shadow-sm group-hover:scale-105 transition-transform duration-300">
                <Image
                  src="/assets/logo-nobg.png"
                  alt="AI Hub Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                AI Hub
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-sm">
              Your unified platform for creating, chatting, and collaborating
              with advanced AI models like GPT-4, Claude, Gemini, and Ollama.
            </p>
            <div className="flex items-center gap-2">
              <Link
                href="https://github.com/aj-seven/ai-hub"
                target="_blank"
                className="p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                <Github className="w-5 h-5" />
              </Link>
              <Link
                href="mailto:ajseven@outlook.in"
                className="p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                <Mail className="w-5 h-5" />
              </Link>
              <Link
                href="https://x.com/aj7_dev"
                className="p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                <Twitter className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Links Grid (8 cols) */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Product</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/get-started"
                    className="hover:text-primary transition-colors"
                  >
                    Get Started
                  </Link>
                </li>
                <li>
                  <Link
                    href="/chat"
                    className="hover:text-primary transition-colors"
                  >
                    AI Chat
                  </Link>
                </li>
                <li>
                  <Link
                    href="/get-started"
                    className="hover:text-primary transition-colors"
                  >
                    Tools
                  </Link>
                </li>
                <li>
                  <Link
                    href="/prompts"
                    className="hover:text-primary transition-colors"
                  >
                    Prompt Library
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Tools</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/tools?id=email-writer"
                    className="hover:text-primary transition-colors"
                  >
                    Email Writer
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tools?id=blog-generator"
                    className="hover:text-primary transition-colors"
                  >
                    Blog Generator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tools?id=text-summarizer"
                    className="hover:text-primary transition-colors"
                  >
                    Summarizer
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tools?id=grammar-checker"
                    className="hover:text-primary transition-colors"
                  >
                    Grammar Checker
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Resources</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="https://github.com/aj-seven/ai-hub/releases"
                    target="_blank"
                    className="hover:text-primary transition-colors"
                  >
                    Download App
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://github.com/aj-seven/ai-hub"
                    target="_blank"
                    className="hover:text-primary transition-colors"
                  >
                    GitHub Repo
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Company</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-primary transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-primary transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-primary transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="mailto:ajseven@outlook.in"
                    className="hover:text-primary transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/50 pt-4 flex flex-col items-center md:flex-row justify-between gap-2 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} AI Hub. All rights reserved.</p>
          <p>Built with ❤️ by aj-seven</p>
        </div>
      </div>
    </footer>
  );
}
