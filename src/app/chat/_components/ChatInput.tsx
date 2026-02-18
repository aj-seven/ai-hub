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
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { ChatSidebar } from "./ChatSidebar";
import clsx from "clsx";
import { ChatInputProps } from "@/types/chat";
import { CustomDialog } from "@/components/ui/custom-dialog";
import { isMobile, formatBytes } from "@/lib/utils";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { OllamaModel } from "@/types/ollama-model";

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
}: ChatInputProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>("");
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
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await apiClient.fetchModels();
        if (res.error) return;

        const models = res?.models || [];
        setModelData(models);

        if (models.length > 0) {
          const storedModel = localStorage.getItem("selectedModel");
          const selected = storedModel || models[0].name;
          setSelectedModel(selected);
          setModel(selected);
        }
      } catch (err) {
        console.error("Failed to fetch models", err);
      }
    };

    fetchModels();
  }, [setModel]);

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
                    {selectedModel || "Select Model"}
                    <ListFilterPlus className="w-3 h-3 opacity-50" />
                  </button>
                }
                triggerLabel="Select Model"
                icon={<ListFilterPlus />}
                className="h-[600px]"
              >
                <div className="space-y-3">
                  {modelData?.map((model: OllamaModel) => (
                    <button
                      key={model.name}
                      onClick={() => {
                        setSelectedModel(model.name);
                        setModel(model.name);
                        localStorage.setItem("selectedModel", model.name);
                        toast.success(`Model changed to ${model.name}`);
                      }}
                      className={clsx(
                        "w-full flex flex-col items-start p-4 border rounded-xl cursor-pointer",
                        selectedModel === model.name
                          ? "border-primary bg-primary/5"
                          : "bg-card"
                      )}
                    >
                      <span className="font-semibold text-sm">
                        {model.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Size: {formatBytes(model.size)}
                      </span>
                    </button>
                  ))}
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
