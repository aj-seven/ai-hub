"use client";

import clsx from "clsx";
import { ChatMessagesProps } from "@/types/chat";
import ReactMarkdown from "react-markdown";
import remarkEmoji from "remark-emoji";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { useEffect, useRef, useState } from "react";
import { Clipboard, Check } from "lucide-react";
import Image from "next/image";
import { copyToClipboard } from "@/lib/utils";

export function ChatMessages({
  messages,
  apiStatus,
  loading,
}: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <section className="w-full h-full overflow-y-auto px-4 pt-4 pb-4 md:pt-8 bg-background/50 scroll-smooth scrollbar-none">
      <div className="max-w-6xl mx-auto pb-40">

        {/* Empty State */}
        {messages.length === 0 && !loading && apiStatus === "online" && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="h-20 w-20 bg-background rounded-2xl flex items-center justify-center shadow-xl ring-1 ring-border/50">
              <Image
                src="/assets/logo-nobg.png"
                alt="AI"
                width={72}
                height={72}
                className="opacity-90"
              />
            </div>

            <div className="space-y-2 max-w-lg">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                How can I help you today?
              </h1>
              <p className="text-muted-foreground text-lg">
                Ask anything — code, ideas, debugging, research.
              </p>
            </div>
          </div>
        )}

        {/* Offline State */}
        {apiStatus === "offline" && (
          <div className="w-full flex justify-center py-10">
            <div className="bg-destructive/10 border border-destructive/20 text-destructive py-2 px-6 rounded-full flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-destructive animate-pulse" />
              <p className="text-sm font-semibold">Ollama Connection Lost</p>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="space-y-6 md:space-y-8">
          {messages.map((msg, idx) => {
            const isUser = msg.role === "user";

            return (
              <div
                key={idx}
                className={clsx(
                  "flex w-full",
                  isUser ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={clsx(
                    "flex gap-3 md:gap-4 max-w-6xl w-full",
                    isUser ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  {/* Avatar */}
                  <div className="shrink-0 pt-0.5">
                    {isUser ? (
                      <div className="w-12 h-12 rounded-full bg-secondary border border-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                        You
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-background border border-border/50 flex items-center justify-center overflow-hidden">
                        <Image
                          src="/assets/logo-nobg.png"
                          alt="AI"
                          width={32}
                          height={32}
                        />
                      </div>
                    )}
                  </div>

                  {/* Bubble */}
                  <div className="relative min-w-0 max-w-[85%] md:max-w-[80%]">
                    <div
                      className={clsx(
                        "px-5 py-3 shadow-sm border text-base leading-relaxed",
                        "bg-primary/5 border-primary/10",
                        isUser
                          ? "rounded-[22px] rounded-tr-md"
                          : "rounded-[22px] rounded-tl-md"
                      )}
                    >
                      {isUser ? (
                        <div className="whitespace-pre-wrap break-words">
                          {msg.content}
                        </div>
                      ) : (
                        <div className="prose dark:prose-invert max-w-none prose-pre:overflow-x-auto prose-pre:bg-muted/40 prose-pre:border prose-pre:border-border/40">
                          <ReactMarkdown
                            remarkPlugins={[remarkEmoji]}
                            components={{
                              a: ({ href, children }) => (
                                <a
                                  href={href || "#"}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary underline underline-offset-4"
                                >
                                  {children}
                                </a>
                              ),

                              code({ className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || "");
                                const [copied, setCopied] = useState(false);
                                const codeText = String(children).replace(/\n$/, "");

                                const handleCopy = async () => {
                                  const success = await copyToClipboard(codeText);
                                  if (success) {
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 2000);
                                  }
                                };

                                return match ? (
                                  <div className="not-prose my-4 rounded-xl border bg-background/40 overflow-hidden">
                                    <div className="flex items-center justify-between px-3 py-1.5 bg-muted/40 border-b">
                                      <span className="text-xs font-mono text-muted-foreground uppercase">
                                        {match[1]}
                                      </span>

                                      <button
                                        onClick={handleCopy}
                                        className="text-muted-foreground hover:text-foreground p-1.5"
                                      >
                                        {copied ? (
                                          <Check size={14} />
                                        ) : (
                                          <Clipboard size={14} />
                                        )}
                                      </button>
                                    </div>

                                    <div className="overflow-x-auto p-4 text-sm font-mono">
                                      <SyntaxHighlighter
                                        style={atomDark}
                                        language={match[1]}
                                        PreTag="div"
                                        customStyle={{
                                          margin: 0,
                                          padding: 0,
                                          background: "transparent",
                                        }}
                                        wrapLongLines
                                        {...(props as any)}
                                      >
                                        {codeText}
                                      </SyntaxHighlighter>
                                    </div>
                                  </div>
                                ) : (
                                  <code className="bg-muted px-1.5 py-0.5 rounded-md text-sm font-mono border">
                                    {codeText}
                                  </code>
                                );
                              },
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex w-full justify-start pl-12 md:pl-16">
              <div className="bg-primary/5 border border-primary/10 rounded-[22px] rounded-tl-md px-4 py-3 inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" />
              </div>
            </div>
          )}

          <div ref={bottomRef} className="h-4" />
        </div>
      </div>
    </section>
  );
}
