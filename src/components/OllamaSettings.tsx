"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Bot, Save, Server, ExternalLink, Key, Info } from "lucide-react";
import { openExternal } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { isTauri } from "@tauri-apps/api/core";

export default function OllamaSettings() {
  const [ollamaHost, setOllamaHost] = useState("");
  const [ollamaApiKey, setOllamaApiKey] = useState("");
  const [ollamaMode, setOllamaMode] = useState("local");

  // Load saved settings from localStorage once on mount
  useEffect(() => {
    const savedHost = localStorage.getItem("ollama_host");
    const savedKey = localStorage.getItem("ollama_api_key");
    const savedMode = localStorage.getItem("ollama_mode");

    setOllamaHost(savedHost || "http://localhost:11434");
    setOllamaApiKey(savedKey || "");
    setOllamaMode(savedMode || "local");
  }, []);

  const handleSaveSettings = () => {
    const trimmedHost = ollamaHost.trim();
    const trimmedKey = ollamaApiKey.trim();

    if (ollamaMode === "local") {
      if (trimmedHost) {
        localStorage.setItem("ollama_host", trimmedHost);
        localStorage.setItem("ollama_mode", "local");
        toast.success("Ollama local settings saved");
      } else {
        toast.error("Please enter a valid host URL");
      }
    } else {
      if (trimmedKey) {
        localStorage.setItem("ollama_api_key", trimmedKey);
        localStorage.setItem("ollama_mode", "cloud");
        toast.success("Ollama Cloud settings saved");
      } else {
        toast.error("Please enter a valid API key");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 border rounded-xl bg-card shadow-sm">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">Ollama</h3>
              <p className="text-xs text-muted-foreground">
                Run local or cloud LLMs
              </p>
            </div>
          </div>
          <button
            onClick={() => openExternal("https://ollama.com")}
            className="text-xs flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
          >
            Visit Ollama <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Local Settings */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Server className="w-4 h-4" /> Local Settings
            </h3>
            <div className="space-y-2">
              <Label htmlFor="ollama-host">Ollama Host (Local)</Label>
              <div className="relative">
                <Server className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="ollama-host"
                  value={ollamaHost}
                  onChange={(e) => setOllamaHost(e.target.value)}
                  placeholder="http://localhost:11434"
                  className="pl-9 text-sm"
                />
              </div>
              <p className="text-[0.8rem] text-muted-foreground mt-1">
                Default: <span className="font-mono">http://localhost:11434</span>
              </p>
            </div>
          </div>

          <div className="h-px bg-border/50" />

          {/* Cloud Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Bot className="w-4 h-4" /> Cloud Settings
            </h3>
            {typeof window !== "undefined" && !isTauri() && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs space-y-2">
                <p className="font-semibold flex items-center gap-2">
                  <Info className="w-3.5 h-3.5" /> Web Platform Limitation
                </p>
                <p>
                  Ollama Cloud API cannot be accessed directly from the browser.
                  Please use our desktop app.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-amber-500 border-amber-500/30 hover:bg-amber-500/10 h-7 text-[10px]"
                  onClick={() => openExternal("https://github.com/aj-seven/ai-hub/releases")}
                >
                  Download Desktop App
                </Button>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="ollama-api-key">API Key (Cloud Secret)</Label>
              <div className="relative">
                <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="ollama-api-key"
                  type="password"
                  value={ollamaApiKey}
                  onChange={(e) => setOllamaApiKey(e.target.value)}
                  placeholder="Enter your Ollama Cloud API key"
                  className="pl-9 text-sm"
                  disabled={typeof window !== "undefined" && !isTauri()}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button onClick={handleSaveSettings} className="w-full gap-2">
            <Save className="w-4 h-4" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
