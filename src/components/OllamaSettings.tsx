"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Bot, Save, Server, ExternalLink } from "lucide-react";
import { openExternal } from "@/lib/utils";

export default function OllamaSettings() {
  const [ollamaHost, setOllamaHost] = useState("");

  // Load saved host from localStorage once on mount
  useEffect(() => {
    const savedHost = localStorage.getItem("ollama_host");
    setOllamaHost(savedHost || "http://localhost:11434");
  }, []);

  const handleSaveHost = () => {
    const trimmedHost = ollamaHost.trim();

    if (trimmedHost) {
      localStorage.setItem("ollama_host", trimmedHost);
      toast.success("Ollama host saved successfully");
    } else {
      localStorage.removeItem("ollama_host");
      toast.error("Please enter a valid host URL");
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 border rounded-xl bg-card shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">Ollama</h3>
              <p className="text-xs text-muted-foreground">
                Run local LLMs (Llama 3, Mistral, etc.)
              </p>
            </div>
          </div>
          <button
            onClick={() => openExternal("https://ollama.com")}
            className="text-xs flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
          >
            Download Ollama <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="ollama-host"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Host URL
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Server className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="ollama-host"
                  type="text"
                  value={ollamaHost}
                  onChange={(e) => setOllamaHost(e.target.value)}
                  placeholder="http://127.0.0.1:11434"
                  className="pl-9 font-mono text-sm"
                />
              </div>
              <Button onClick={handleSaveHost} className="gap-2">
                <Save className="w-4 h-4" />
                Save
              </Button>
            </div>
            <p className="text-[0.8rem] text-muted-foreground">
              Current host:{" "}
              <span className="font-mono text-foreground">
                {typeof window !== "undefined"
                  ? localStorage.getItem("ollama_host") ||
                  "http://localhost:11434"
                  : ollamaHost}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
