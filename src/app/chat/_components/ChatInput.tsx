"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Send,
  StopCircle,
  PanelLeft,
  ListFilterPlus,
  Info,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { ChatSidebar } from "./ChatSidebar";
import { ChatInputProps } from "@/types/chat";
import { CustomDialog } from "@/components/ui/custom-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ModelDetailsItem } from "./ModelDetailsItem";
import { isMobile } from "@/lib/utils";
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
  setSystemMessage,
  apiStatus,
}: ChatInputProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [modelData, setModelData] = useState<any>(null);
  const [systemPromptInput, setSystemPromptInput] = useState("");

  // Auto resize textarea
  const autoResize = useCallback((el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, []);

  // Fetch models on mount
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await apiClient.fetchModels();

        if (res.error) {
          console.error("Failed to fetch models:", res.error);
          return;
        }

        const models = res?.models || [];
        setModelData(models);

        if (models.length > 0) {
          const names = models.map((m: any) => m.name);

          const storedModel = localStorage.getItem("selectedModel");
          const selectedModel = storedModel || names[0];
          setSelectedModel(selectedModel);
          setModel(selectedModel);
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

    // Desktop: Enter = send, Shift+Enter = newline
    // Mobile: Enter = newline, Shift+Enter = send
    const shouldSend = isMobile()
      ? e.shiftKey && isEnter
      : isEnter && !e.shiftKey;

    if (shouldSend) {
      e.preventDefault(); // prevent newline
      if (input.trim()) onSend();
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (input.trim()) onSend();
      }}
      className="sticky bottom-0 w-full bg-background border-t px-3 pt-3 pb-2 rounded-t-2xl"
    >
      {/* Input Box */}
      <textarea
        ref={textareaRef}
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        disabled={loading || disabled || apiStatus === "offline"}
        rows={1}
        className={`w-full resize-none overflow-auto max-h-[200px] rounded-md border border-input bg-background px-4 py-3 text-sm ${
          apiStatus === "offline" ? "cursor-not-allowed" : ""
        }`}
      />

      {/* Control Panel */}
      <div className="flex flex-row items-center justify-between width-full gap-2">
        {/* Sidebar Toggle */}
        <div className="flex flex-row gap-2 w-auto">
          <Dialog.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
            <Dialog.Trigger asChild>
              <Button type="button" variant="outline">
                <PanelLeft className="w-5 h-5" />
              </Button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
              <Dialog.Content className="fixed top-0 left-0 bottom-0 w-2/3 md:w-1/4 bg-background z-50 border-r shadow-lg">
                <ChatSidebar
                  {...sidebarProps}
                  onClose={() => setDrawerOpen(false)}
                />
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>

          <div>
            <CustomDialog
              title="Info"
              description="Show Info"
              triggerLabel="Info"
              icon={<Info className="w-5 h-5" />}
            >
              <div className="space-y-1">
                <h1 className="text-md">
                  <strong>Selected Model:</strong> {selectedModel}
                </h1>
                <p className="text-md">
                  <strong>System Prompt:</strong> {systemPromptInput || "N/A"}
                </p>
              </div>
            </CustomDialog>
          </div>
          {/* Model Selector */}
          <div>
            <CustomDialog
              title="Select Model"
              description="Choose a model for generating responses"
              triggerLabel="Select Model"
              icon={<ListFilterPlus />}
            >
              <div className="w-full space-y-2">
                {/* model details */}
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  <h3 className="font-semibold text-sm">Available Models</h3>
                  {modelData?.map((model: OllamaModel, index: number) => (
                    <ModelDetailsItem key={index} model={model} />
                  ))}
                </div>
                <div>
                  <label
                    htmlFor="model"
                    className="font-semibold text-sm block"
                  >
                    Select Model
                  </label>
                  <Select
                    value={selectedModel}
                    onValueChange={(value) => {
                      setSelectedModel(value);
                      setModel(value);
                      localStorage.setItem("selectedModel", value);
                    }}
                  >
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      {modelData?.map((model: OllamaModel) => (
                        <SelectItem key={model.name} value={model.name}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* System Prompt Input */}
                <div>
                  <label
                    htmlFor="system-prompt"
                    className="font-semibold text-sm block mb-1"
                  >
                    System Prompt
                  </label>
                  <textarea
                    id="system-prompt"
                    value={systemPromptInput}
                    onChange={(e) => setSystemPromptInput(e.target.value)}
                    placeholder="e.g. You are a tarot reader..."
                    className="w-full border rounded px-3 py-2 text-sm resize-none"
                    rows={3}
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      localStorage.setItem("systemMessage", systemPromptInput);
                      toast.success("System message saved.");
                      setSystemMessage(systemPromptInput);
                    }}
                    variant="outline"
                    className="mt-2 cursor-pointer"
                  >
                    Save System Message
                  </Button>
                </div>
              </div>
            </CustomDialog>
          </div>
        </div>
        {/* Send/Stop Button */}
        {loading ? (
          <Button
            type="button"
            onClick={stopStream}
            variant="destructive"
            className="w-12 h-12"
          >
            <StopCircle className="w-5 h-5" />
          </Button>
        ) : (
          <Button type="submit" className="w-14 h-10" disabled={!input.trim()}>
            <Send className="w-5 h-5" />
          </Button>
        )}
      </div>
    </form>
  );
}
