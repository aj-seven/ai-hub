"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { copyToClipboard } from "@/lib/utils";
import {
  ArrowLeft,
  Copy,
  Download,
  RefreshCw,
  Sparkles,
  CheckCircle,
  Zap,
  AlertCircle,
} from "lucide-react";
import { toolConfigs } from "@/app/tools/_components/ToolConfig";
import Tips from "./Tips";
import Footer from "@/components/Footer";

export default function ToolPage() {
  const params = useSearchParams();
  const router = useRouter();
  const toolId = params.get("id") || "id";

  const [input, setInput] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("openai");
  const [selectedModel, setSelectedModel] = useState("");
  const [output, setOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [usage, setUsage] = useState<any>(null);
  const [apiKey, setApiKey] = useState("");

  type Provider = {
    label: string;
    value: string;
    models?: { label: string; value: string }[];
  };

  const [availableProviders, setAvailableProviders] = useState<Provider[]>([]);
  const [availableModels, setAvailableModels] = useState<
    { label: string; value: string }[]
  >([]);

  const [apiStatus, setApiStatus] = useState<"loading" | "online" | "offline">(
    "loading"
  );

  const toolConfig = toolConfigs[toolId];

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await apiClient.getStatus();
        if (response.providers && response.aiProviders) {
          const validProviders = response.aiProviders.filter((p) =>
            response.providers?.includes(p.value)
          );
          const filteredProviders: Provider[] = validProviders.map((p) => ({
            label: p.label,
            value: p.value,
            models: p.models?.map((m) => ({
              label: m.label || m.name || m.value || m.id,
              value: m.value || m.id,
            })),
          }));
          setAvailableProviders(filteredProviders);
          setApiStatus(response.success ? "online" : "offline");
        } else {
          setAvailableProviders([]);
          setApiStatus("offline");
        }
      } catch (error) {
        console.error("Failed to check API status:", error);
        setAvailableProviders([]);
        setApiStatus("offline");
      }
    };
    checkApiStatus();
  }, []);

  useEffect(() => {
    const key = localStorage.getItem(`api_key_${selectedProvider}`);
    setApiKey(key as string);
    const provider = availableProviders.find(
      (p) => p.value === selectedProvider
    );
    if (provider?.models) {
      setAvailableModels(provider.models);
      setSelectedModel(provider.models[0]?.value || "");
    } else {
      setAvailableModels([]);
      setSelectedModel("");
    }
  }, [selectedProvider, availableProviders]);

  useEffect(() => {
    if (toolConfig?.options && toolConfig.options.length > 0) {
      setSelectedOption(toolConfig.options[0].value);
    }
  }, [toolConfig]);

  if (!toolConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-2xl font-bold">Tool Not Found</h1>
          <Button onClick={() => router.push("/get-started")} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Tools
          </Button>
        </div>
      </div>
    );
  }

  const handleGenerate = async () => {
    if (!input.trim()) {
      toast.error("Please enter some text to generate content.");
      return;
    }

    setIsGenerating(true);
    setOutput("");
    setUsage(null);

    try {
      // Build prompt logic
      let prompt = input.trim();
      if (selectedOption) {
        const optionPrompts: Record<string, string> = {
          "email-writer": `Write a single ${selectedOption} email about: ${prompt}`,
          "tweet-generator": `Write one ${selectedOption} tweet about: ${prompt}`,
          "sentence-builder": `Convert this idea into one ${selectedOption} sentence: ${prompt}`,
          "text-summarizer": `Provide a concise ${selectedOption} summary of the following: ${prompt}`,
          "content-rewriter": `Rewrite this content into a single, ${selectedOption} version: ${prompt}`,
          "blog-generator": `Write one ${selectedOption} blog post about: ${prompt}`,
          "caption-generator": `Write one ${selectedOption} social media caption for: ${prompt}`,
          "grammar-checker": `Check and return the corrected version of this text: ${prompt}`,
        };
        prompt = optionPrompts[toolId] || prompt;
      }

      const response = await apiClient.generate({
        prompt,
        tool: toolId,
        provider: selectedProvider,
        model: selectedModel,
        apiKey: apiKey,
        options: {
          style: selectedOption,
          maxTokens: 1500,
          temperature: 0.7,
        },
      });

      if (response.success && response.content) {
        setOutput(response.content);
        setUsage(response.usage);
        toast.success(`Generated successfully`);
      } else {
        throw new Error(
          response.details || response.error || "Failed to generate"
        );
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(output);
    if (success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast.success("Copied to clipboard");
    } else {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${toolConfig.title
      .toLowerCase()
      .replace(/\s+/g, "-")}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Downloaded");
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/get-started")}
              className="-ml-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <div className="h-6 w-px bg-border/50 hidden sm:block" />
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                {toolConfig.icon}
              </div>
              <div>
                <h1 className="text-lg font-semibold tracking-tight leading-none">
                  {toolConfig.title}
                </h1>
                <p className="text-xs text-muted-foreground hidden md:block mt-0.5">
                  {toolConfig.description}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {selectedProvider && (
              <Badge
                variant="secondary"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1 h-8 rounded-full border-primary/10 bg-primary/5 text-primary"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span className="font-medium">{selectedProvider}</span>
              </Badge>
            )}
            {apiStatus === "offline" && (
              <Badge variant="destructive" className="animate-pulse">
                Offline
              </Badge>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-4 md:py-6">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Sidebar - Configuration */}
          <div className="w-full lg:w-[500px] flex-shrink-0 space-y-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-primary/50 to-primary" />
              <CardHeader className="pb-4 border-b border-border/50 bg-muted/20">
                <CardTitle className="text-base font-semibold">
                  Configuration
                </CardTitle>
                <CardDescription className="text-xs">
                  Adjust settings for your generation.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 space-y-5">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    {toolConfig.inputLabel}
                  </Label>
                  <Textarea
                    placeholder={toolConfig.inputPlaceholder}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="min-h-[120px] resize-none bg-background/50 focus:bg-background border-border/50"
                  />
                </div>

                {toolConfig.options && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      {toolConfig.optionLabel}
                    </Label>
                    <Select
                      value={selectedOption}
                      onValueChange={setSelectedOption}
                    >
                      <SelectTrigger className="bg-background/50 border-border/50">
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        {toolConfig.options.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {toolConfig.aiProviderVisible && (
                  <div className="space-y-4 pt-4 border-t border-border/50">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <Label className="text-sm font-medium">Provider</Label>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">
                          Required
                        </span>
                      </div>
                      <Select
                        value={selectedProvider}
                        onValueChange={setSelectedProvider}
                      >
                        <SelectTrigger className="bg-background/50 border-border/50">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableProviders.map((p) => (
                            <SelectItem key={p.value} value={p.value}>
                              {p.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Model</Label>
                      <Select
                        value={selectedModel}
                        onValueChange={setSelectedModel}
                        disabled={availableModels.length === 0}
                      >
                        <SelectTrigger className="bg-background/50 border-border/50">
                          <SelectValue
                            placeholder={
                              availableModels.length === 0
                                ? "No models"
                                : "Select model"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {availableModels.map((m) => (
                            <SelectItem key={m.value} value={m.value}>
                              {m.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {!availableProviders.length && (
                  <div className="bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-500 p-3 rounded-lg text-xs leading-relaxed border border-amber-200 dark:border-amber-900/50 flex gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>
                      No active providers. Configure keys in Settings.
                    </span>
                  </div>
                )}

                <Button
                  onClick={handleGenerate}
                  disabled={!input.trim() || isGenerating}
                  className="w-full shadow-lg shadow-primary/20"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" /> Generate Content
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Output */}
          <div className="flex-1 min-w-0 space-y-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-sm h-full min-h-[600px] flex flex-col">
              <CardHeader className="py-3 px-6 border-b border-border/50 bg-muted/20 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <CardTitle className="text-base font-semibold">
                    Output
                  </CardTitle>
                </div>
                {output && (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopy}
                      className="h-8 w-8 p-0"
                    >
                      {isCopied ? (
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Copy className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDownload}
                      className="h-8 w-8 p-0"
                    >
                      <Download className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="flex-1 p-0 flex flex-col relative">
                {output ? (
                  <div className="flex-1 p-4 md:p-8 overflow-auto custom-scrollbar">
                    <div className="prose prose-sm dark:prose-invert max-w-none font-mono whitespace-pre-wrap leading-relaxed text-foreground/90">
                      {output}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-muted-foreground/60">
                    <div className="w-24 h-24 rounded-3xl bg-muted/30 flex items-center justify-center mb-6 border border-border/50">
                      <Sparkles className="h-10 w-10 opacity-30" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground/80 mb-2">
                      Ready to Create
                    </h3>
                    <p className="text-sm max-w-sm mx-auto leading-relaxed">
                      Configure your settings on the left and click "Generate"
                      to see your content appear here.
                    </p>
                  </div>
                )}

                {usage && (
                  <div className="bg-muted/30 border-t border-border/50 p-2 px-6 flex justify-end text-[10px] text-muted-foreground gap-4">
                    <span>
                      Prompt:{" "}
                      <span className="font-medium text-foreground">
                        {usage.promptTokens}
                      </span>
                    </span>
                    <span>
                      Completion:{" "}
                      <span className="font-medium text-foreground">
                        {usage.completionTokens}
                      </span>
                    </span>
                    <span>
                      Total:{" "}
                      <span className="font-medium text-foreground">
                        {usage.totalTokens}
                      </span>
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        <Tips />
        <Footer />
      </main>
    </div>
  );
}
