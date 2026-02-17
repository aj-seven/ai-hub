"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { openExternal } from "@/lib/utils";
import {
  Eye,
  EyeOff,
  Save,
  Trash2,
  Bot,
  Sparkles,
  Zap,
  Brain,
  ExternalLink,
} from "lucide-react";

const providers = [
  {
    id: "openai",
    name: "OpenAI",
    icon: Bot,
    url: "https://platform.openai.com/api-keys",
    description: "GPT-4, GPT-3.5 Turbo, DALL-E",
  },
  {
    id: "anthropic",
    name: "Anthropic",
    icon: Brain,
    url: "https://console.anthropic.com/settings/keys",
    description: "Claude 3.5 Sonnet, Haiku, Opus",
  },
  {
    id: "google",
    name: "Google Gemini",
    icon: Sparkles,
    url: "https://aistudio.google.com/app/apikey",
    description: "Gemini 1.5 Pro, Flash",
  },
  {
    id: "cohere",
    name: "Cohere",
    icon: Zap,
    url: "https://dashboard.cohere.com/api-keys",
    description: "Command R, R+",
  },
];

export default function APIKeys() {
  const [keys, setKeys] = useState<Record<string, string>>({});
  const [visible, setVisible] = useState<Record<string, boolean>>({});

  // Load keys on mount
  useEffect(() => {
    const loadedKeys: Record<string, string> = {};
    providers.forEach((p) => {
      const stored = localStorage.getItem(`api_key_${p.id}`);
      if (stored) loadedKeys[p.id] = stored;
    });
    setKeys(loadedKeys);
  }, []);

  const handleSave = (providerId: string, newValue: string) => {
    if (!newValue.trim()) {
      toast.error("API key cannot be empty");
      return;
    }
    localStorage.setItem(`api_key_${providerId}`, newValue.trim());
    setKeys((prev) => ({ ...prev, [providerId]: newValue.trim() }));
    toast.success(`${providerId} API Key saved`);
  };

  const handleDelete = (providerId: string) => {
    localStorage.removeItem(`api_key_${providerId}`);
    setKeys((prev) => {
      const newKeys = { ...prev };
      delete newKeys[providerId];
      return newKeys;
    });
    toast.success(`${providerId} API Key removed`);
  };

  const toggleVisibility = (providerId: string) => {
    setVisible((prev) => ({ ...prev, [providerId]: !prev[providerId] }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        {providers.map((provider) => {
          const Icon = provider.icon;
          const isStored = !!keys[provider.id];
          const isVisible = !!visible[provider.id];
          const currentKey = keys[provider.id] || "";

          return (
            <div
              key={provider.id}
              className="flex flex-col gap-4 p-4 border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{provider.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {provider.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => openExternal(provider.url)}
                  className="text-xs flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                >
                  Get Key <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type={isVisible ? "text" : "password"}
                    placeholder={`sk-...`}
                    className="pr-10 font-mono text-sm"
                    value={currentKey}
                    onChange={(e) =>
                      setKeys((prev) => ({
                        ...prev,
                        [provider.id]: e.target.value,
                      }))
                    }
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute right-0 top-0 h-full w-10 text-muted-foreground hover:text-foreground"
                    onClick={() => toggleVisibility(provider.id)}
                  >
                    {isVisible ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                <Button
                  size="icon"
                  variant={isStored ? "outline" : "default"}
                  onClick={() => handleSave(provider.id, currentKey)}
                  title="Save Key"
                >
                  <Save className="w-4 h-4" />
                </Button>

                {isStored && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                    onClick={() => handleDelete(provider.id)}
                    title="Delete Key"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
