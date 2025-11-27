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
    <section className="flex-1 h-full relative overflow-y-auto px-2 py-6 bg-background">
      {messages.length === 0 && !loading && apiStatus === "online" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl italic">Let’s start a conversation...</span>
        </div>
      )}

      {apiStatus === "offline" && (
        <div className="fixed top-14 left-0 right-0 z-50">
          <div className="bg-red-500 text-white text-center py-2 px-4 shadow-md">
            <p className="font-semibold">⚠️ Ollama API is offline</p>
            <p className="text-sm">
              Please configure the API host in Settings.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {messages.map((msg, idx) => {
          const isUser = msg.role === "user";

          return (
            <div key={idx}>
              <div
                className={clsx(
                  "flex w-full md:p-4",
                  isUser ? "justify-end" : "justify-start"
                )}
              >
                {!isUser && (
                  <div className="w-10 h-10 rounded-full bg-muted text-xs font-bold flex items-center justify-center border shrink-0">
                    <Image
                      src="/assets/logo-nobg.png"
                      alt="AH"
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                  </div>
                )}
                <div
                  className={clsx(
                    "px-2 py-2 rounded-md",
                    "max-w-full sm:max-w-[80%] w-fit",
                    "whitespace-pre-wrap break-words overflow-wrap break-word",
                    "overflow-hidden",
                    isUser ? "bg-indigo-600 text-white" : ""
                  )}
                >
                  <div className="prose dark:prose-invert max-w-full prose-pre:overflow-x-auto prose-code:break-words relative">
                    <ReactMarkdown
                      remarkPlugins={[remarkEmoji]}
                      components={{
                        a: ({ href, children }) => (
                          <a
                            href={href || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:text-blue-800"
                          >
                            {children}
                          </a>
                        ),
                        code({ className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || "");
                          const [copied, setCopied] = useState(false);
                          const codeText = String(children).replace(/\n$/, "");

                          const handleCopy = () => {
                            navigator.clipboard.writeText(codeText);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          };

                          return match ? (
                            <div className="flex flex-row items-center rounded-md">
                              <div className="flex flex-col border rounded-md bg-background overflow-x-auto">
                                <div className="flex items-center justify-between px-1 border-b">
                                  <span className="text-sm font-mono">
                                    {match[1]}
                                  </span>
                                  <button
                                    onClick={handleCopy}
                                    className="opacity-70 hover:opacity-100 transition-opacity p-1 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                                    aria-label="Copy code"
                                    type="button"
                                  >
                                    {copied ? (
                                      <Check size={16} />
                                    ) : (
                                      <Clipboard size={16} />
                                    )}
                                  </button>
                                </div>

                                <div className="overflow-x-auto">
                                  <SyntaxHighlighter
                                    style={atomDark}
                                    language={match[1]}
                                    PreTag="div"
                                    className="rounded-md"
                                    wrapLongLines
                                    {...(props as any)}
                                  >
                                    {codeText}
                                  </SyntaxHighlighter>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <code
                              className="bg-black/10 px-1 rounded break-words text-sm"
                              {...props}
                            >
                              {codeText}
                            </code>
                          );
                        },
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 ml-6 text-sm text-muted-foreground">
            <div className="flex gap-1 items-center">
              <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </section>
  );
}
