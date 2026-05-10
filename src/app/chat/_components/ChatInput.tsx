"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Send,
  StopCircle,
  PanelLeft,
  ListFilterPlus,
  Info,
  Paperclip,
  Globe,
  Server,
  Bot,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { ChatSidebar } from "./ChatSidebar";
import clsx from "clsx";
import { ChatInputProps } from "@/types/chat";
import { CustomDialog } from "@/components/ui/custom-dialog";
import { isMobile, formatBytes, openExternal } from "@/lib/utils";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { isTauri } from "@tauri-apps/api/core";
import { Model } from "@/types/api-client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export function ChatInput({
  input,
  setInput,
  loading,
  onSend,
  stopStream,
  disabled,
  setModel,
  sidebarProps,
  systemMessage,
  setSystemMessage,
  apiStatus,
  onModelDataUpdate,
}: ChatInputProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [activeServiceTab, setActiveServiceTab] = useState<string>("local");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [modelData, setModelData] = useState<any>(null);
  const [systemPromptInput, setSystemPromptInput] = useState(systemMessage);

  // Update local input when prop changes (e.g. from page load)
  useEffect(() => {
    setSystemPromptInput(systemMessage);
  }, [systemMessage]);

  // Auto Resize
  const autoResize = useCallback((el: HTMLTextAreaElement) => {
    const computed = window.getComputedStyle(el);
    const lineHeight = parseFloat(computed.lineHeight);

    const baseLines = 2; // initial fixed size
    const maxLines = 12; // stop growing here

    const minHeight = lineHeight * baseLines;
    const maxHeight = lineHeight * maxLines;

    el.style.height = "auto";

    const nextHeight = Math.min(
      Math.max(el.scrollHeight, minHeight),
      maxHeight
    );

    el.style.height = `${nextHeight}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
  }, []);

  useEffect(() => {
    if (textareaRef.current) autoResize(textareaRef.current);
  }, [autoResize]);

  // Fetch Models
  const fetchModels = useCallback(async () => {
    try {
      const res = await apiClient.getStatus();
      if (!res.success) return;

      // Extract all models from all providers
      const allModels = (res.aiProviders || [])
        .filter(p => p.models)
        .flatMap(p => p.models) as Model[];

      setModelData(allModels);
      if (onModelDataUpdate) onModelDataUpdate(allModels);

      if (allModels.length > 0) {
        const storedModel = localStorage.getItem("selectedModel");

        // Find best match for stored model
        let selected = allModels[0].id;
        if (storedModel) {
          // 1. Try exact ID match
          const idMatch = allModels.find(m => m.id === storedModel);
          if (idMatch) {
            selected = idMatch.id;
          } else {
            // 2. Try name match (fallback for old storage)
            const nameMatch = allModels.find(m => m.name === storedModel);
            if (nameMatch) {
              selected = nameMatch.id;
              localStorage.setItem("selectedModel", selected);
            }
          }
        }

        setSelectedModel(selected);
        setModel(selected);
      }
    } catch (err) {
      console.error("Failed to fetch models", err);
    }
  }, [setModel, onModelDataUpdate]);

  useEffect(() => {
    fetchModels();
    const currentService = localStorage.getItem("selected_ollama_service") || "local";
    setActiveServiceTab(currentService);

    const handleSync = () => {
      fetchModels();
      const currentService = localStorage.getItem("selected_ollama_service") || "local";
      setActiveServiceTab(currentService);
    };

    window.addEventListener("storage_sync", handleSync);
    window.addEventListener("storage", handleSync);

    return () => {
      window.removeEventListener("storage_sync", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, [fetchModels]);

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    autoResize(e.target);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isEnter = e.key === "Enter";

    const shouldSend = isMobile()
      ? e.shiftKey && isEnter
      : isEnter && !e.shiftKey;

    if (shouldSend) {
      e.preventDefault();
      if (input.trim()) onSend();
    }
  };

  return (
    <div className="bottom-0 left-0 right-0 w-full px-4 pb-1 md:pb-5 pt-2 flex justify-center z-50 pointer-events-none">
      <div className="w-full max-w-6xl pointer-events-auto flex flex-col gap-1.5 bg-background/20 backdrop-blur-xl border border-border/95 shadow-md rounded-[16px] p-1 transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/30 focus-within:bg-background/30">
        {/* Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim()) onSend();
          }}
          className={clsx(
            "w-full bg-background/40 rounded-[20px] p-2 transition-all duration-300",
            loading && "opacity-90 cursor-wait"
          )}
        >
          <div className="flex items-center gap-4">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Start Chatting..."
              disabled={loading || disabled || apiStatus === "offline"}
              rows={1}
              className="w-full resize-none bg-transparent border-0 outline-none px-3 py-1 text-base leading-6 max-h-[288px] overflow-hidden"
            />
            {loading ? (
              <Button
                type="button"
                onClick={stopStream}
                variant="destructive"
                size="icon"
                className="h-12 w-12 rounded-full cursor-pointer"
              >
                <StopCircle className="w-12 h-12" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim()}
                className="h-12 w-12 rounded-full cursor-pointer"
              >
                <Send className="w-12 h-12" />
              </Button>
            )}
          </div>
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="lg:hidden">
                  <Dialog.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
                    <Dialog.Trigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-full cursor-pointer"
                      >
                        <PanelLeft className="w-4 h-4" />
                      </Button>
                    </Dialog.Trigger>
                    <Dialog.Portal>
                      <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" />
                      <Dialog.Content className="fixed top-0 left-0 bottom-0 w-[85vw] max-w-[300px] bg-background z-50 border-r shadow-2xl outline-none">
                        <ChatSidebar
                          {...sidebarProps}
                          onClose={() => setDrawerOpen(false)}
                        />
                      </Dialog.Content>
                    </Dialog.Portal>
                  </Dialog.Root>
                </div>
              </div>
              <button
                type="button"
                className="p-2 hover:bg-muted/50 rounded-full cursor-pointer"
                onClick={() => toast.info("Coming soon!")}
              >
                <Paperclip className="w-5 h-5" />
              </button>
              <button
                type="button"
                className="p-2 hover:bg-muted/50 rounded-full cursor-pointer"
                onClick={() => toast.info("Coming soon!")}
              >
                <Globe className="w-5 h-5" />
              </button>

              {/* Model Selector */}
              <CustomDialog
                title="Select Model"
                description="Choose a model"
                customTrigger={
                  <button
                    type="button"
                    className="w-full flex items-center justify-between gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-all bg-background/40 hover:bg-background/60 px-3 py-1.5 rounded-full border border-border/20 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      {selectedModel && (
                        <span className={clsx(
                          "text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider",
                          modelData?.find((m: Model) => m.id === selectedModel)?.provider === 'cloud'
                            ? "bg-primary/20 text-primary"
                            : "bg-muted-foreground/20 text-muted-foreground"
                        )}>
                          {modelData?.find((m: Model) => m.id === selectedModel)?.provider === 'cloud' ? 'cloud' : 'local'}
                        </span>
                      )}
                      {modelData?.find((m: Model) => m.id === selectedModel)?.name || selectedModel || "Select Model"}
                    </div>
                    <ListFilterPlus className="w-3 h-3 opacity-50" />
                  </button>
                }
                triggerLabel="Select Model"
                icon={<ListFilterPlus />}
                className="h-[600px]"
              >
                <div className="space-y-6">
                  <Tabs defaultValue="local" value={activeServiceTab} className="w-full" onValueChange={(val) => {
                    setActiveServiceTab(val);
                    localStorage.setItem("selected_ollama_service", val);
                    window.dispatchEvent(new Event("storage_sync"));
                  }}>
                    <TabsList className="grid w-full grid-cols-2 mb-6 h-10 p-1 bg-muted/40 rounded-xl">
                      <TabsTrigger value="local" className="rounded-lg flex items-center gap-2">
                        <Server className="w-3.5 h-3.5" /> Local
                      </TabsTrigger>
                      <TabsTrigger value="cloud" className="rounded-lg flex items-center gap-2">
                        <Bot className="w-3.5 h-3.5" /> Cloud
                      </TabsTrigger>
                    </TabsList>

                    {/* Local Models Content */}
                    <TabsContent value="local" className="space-y-4 focus-visible:outline-none">
                      <div className="space-y-2">
                        {modelData?.filter((m: Model) => m.provider === 'local').length === 0 ? (
                          <div className="p-4 rounded-2xl border border-dashed text-center text-xs text-muted-foreground bg-muted/20">
                            No local models found. Make sure Ollama is running.
                          </div>
                        ) : (
                          modelData?.filter((m: Model) => m.provider === 'local').map((model: Model) => (
                            <button
                              key={model.id}
                              onClick={() => {
                                setSelectedModel(model.id);
                                setModel(model.id);
                                localStorage.setItem("selectedModel", model.id);
                              }}
                              className={clsx(
                                "w-full flex items-start gap-4 p-4 rounded-2xl border transition-all text-left group",
                                selectedModel === model.id
                                  ? "bg-primary/5 border-primary shadow-sm"
                                  : "bg-background/40 border-border/50 hover:bg-background/60 hover:border-border"
                              )}
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <span className="font-semibold text-sm group-hover:text-primary transition-colors">
                                    {model.name}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground font-mono shrink-0">
                                    {model.size ? formatBytes(model.size) : ""}
                                  </span>
                                </div>
                                {model.description && (
                                  <p className="text-xs text-muted-foreground line-clamp-1 italic">
                                    {model.description}
                                  </p>
                                )}
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    </TabsContent>

                    {/* Cloud/Online Content */}
                    <TabsContent value="cloud" className="space-y-4 focus-visible:outline-none">
                      {/* Web Limitation Alert */}
                      {typeof window !== "undefined" && !isTauri() && (
                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs space-y-2">
                          <p className="font-semibold flex items-center gap-2">
                            <Info className="w-3.5 h-3.5" /> Platform Limitation
                          </p>
                          <p>
                            Cloud models are best experienced via our desktop application.
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
                        {modelData?.filter((m: Model) => m.provider === 'cloud').length === 0 ? (
                          <div className="p-4 rounded-2xl border border-dashed text-center text-xs text-muted-foreground bg-muted/20">
                            Configure your cloud settings to see available models.
                          </div>
                        ) : (
                          modelData?.filter((m: Model) => m.provider === 'cloud').map((model: Model) => (
                            <button
                              key={model.id}
                              onClick={() => {
                                if (!isTauri() && model.id.startsWith("ollama-cloud")) {
                                  toast.error("Ollama Cloud models require the desktop app.");
                                  return;
                                }
                                setSelectedModel(model.id);
                                setModel(model.id);
                                localStorage.setItem("selectedModel", model.id);
                              }}
                              className={clsx(
                                "w-full flex items-start gap-4 p-4 rounded-2xl border transition-all text-left group",
                                selectedModel === model.id
                                  ? "bg-primary/5 border-primary shadow-sm"
                                  : "bg-background/40 border-border/50 hover:bg-background/60 hover:border-border",
                                !isTauri() && model.id.startsWith("ollama-cloud") && "opacity-50 grayscale cursor-not-allowed"
                              )}
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <span className="font-semibold text-sm group-hover:text-primary transition-colors">
                                    {model.name}
                                  </span>
                                  <span className={clsx(
                                    "text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-primary/20 text-primary"
                                  )}>
                                    CLOUD
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-1 italic">
                                  {model.id.startsWith("ollama-cloud") ? "Hosted on ollama.com" : "Cloud AI Provider"}
                                </p>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </CustomDialog>

              {/* Toolbar */}
              <div className="flex items-center justify-between">
                <CustomDialog
                  title="System Configuration"
                  description="Customize the assistant's behavior and personality."
                  triggerLabel="Configuration"
                  customTrigger={
                    <button
                      type="button"
                      className="p-1.5 text-muted-foreground hover:text-foreground rounded-full cursor-pointer"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  }
                  icon={<Info />}
                >
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        System Message
                      </label>
                      <textarea
                        value={systemPromptInput}
                        onChange={(e) => setSystemPromptInput(e.target.value)}
                        placeholder="e.g. You are a helpful AI assistant..."
                        className="w-full h-32 p-3 text-sm bg-muted/50 border rounded-xl resize-none outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                    <Button
                      className="w-full h-10 rounded-xl font-medium"
                      onClick={() => {
                        setSystemMessage(systemPromptInput);
                        localStorage.setItem(
                          "systemMessage",
                          systemPromptInput
                        );
                        toast.success("System message updated successfully");
                      }}
                    >
                      Save Changes
                    </Button>
                  </div>
                </CustomDialog>
              </div>
            </div>
          </div>
        </form>

        <p className="text-[10px] text-muted-foreground/60 text-center">
          AI can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
}
