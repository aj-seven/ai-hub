import {
  GenerateRequest,
  GenerateResponse,
  Provider,
  Model,
  OllamaModel,
} from "@/types/api-client";
import { invoke, isTauri } from "@tauri-apps/api/core";
import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatCohere } from "@langchain/cohere";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { CohereClient } from "cohere-ai";

class APIClient {
  // Get default model for a provider
  private getDefaultModel(provider: string): string {
    const defaults: Record<string, string> = {
      openai: "gpt-4o",
      anthropic: "claude-3-opus-20240229",
      google: "gemini-1.5-pro",
      cohere: "command-r-plus",
    };
    return defaults[provider] || "gpt-4o";
  }

  // Get available models for a provider
  private async getProviderModels(provider: string): Promise<Model[]> {
    const apiKey = localStorage.getItem(`api_key_${provider}`);

    try {
      if (provider === "openai") {
        if (!apiKey) return [
          { id: "gpt-4o", name: "GPT-4o", value: "gpt-4o", label: "GPT-4o" },
          { id: "gpt-4o-mini", name: "GPT-4o Mini", value: "gpt-4o-mini", label: "GPT-4o Mini" },
        ];

        const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
        const data = await openai.models.list();
        return data.data
          .filter((m) => m.id.startsWith("gpt-") || m.id.startsWith("o1-"))
          .map((m) => ({
            id: m.id,
            name: m.id,
            value: m.id,
            label: m.id,
          }));
      }

      if (provider === "anthropic") {
        if (!apiKey) return [
          { id: "claude-3-5-sonnet-latest", name: "Claude 3.5 Sonnet", value: "claude-3-5-sonnet-latest", label: "Claude 3.5 Sonnet" },
          { id: "claude-3-7-sonnet-latest", name: "Claude 3.7 Sonnet", value: "claude-3-7-sonnet-latest", label: "Claude 3.7 Sonnet" },
        ];

        try {
          const anthropic = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
          const data = await anthropic.models.list();
          return data.data.map((m) => ({
            id: m.id,
            name: m.display_name || m.id,
            value: m.id,
            label: m.display_name || m.id,
          }));
        } catch (e) {
          console.warn("Failed to fetch Anthropic models, using fallback", e);
        }

        return [
          { id: "claude-3-7-sonnet-20250219", name: "Claude 3.7 Sonnet", value: "claude-3-7-sonnet-20250219", label: "Claude 3.7 Sonnet" },
          { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet", value: "claude-3-5-sonnet-20241022", label: "Claude 3.5 Sonnet" },
          { id: "claude-3-opus-20240229", name: "Claude 3 Opus", value: "claude-3-opus-20240229", label: "Claude 3 Opus" },
          { id: "claude-3-sonnet-20240229", name: "Claude 3 Sonnet", value: "claude-3-sonnet-20240229", label: "Claude 3 Sonnet" },
          { id: "claude-3-haiku-20240307", name: "Claude 3 Haiku", value: "claude-3-haiku-20240307", label: "Claude 3 Haiku" },
        ];
      }

      if (provider === "google") {
        if (!apiKey) return [
          { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", value: "gemini-1.5-pro", label: "Gemini 1.5 Pro" },
          { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", value: "gemini-1.5-flash", label: "Gemini 1.5 Flash" },
        ];

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        if (!response.ok) throw new Error("Failed to fetch Google models");
        const data = await response.json();
        return data.models
          .filter((m: any) => m.supportedGenerationMethods.includes("generateContent"))
          .map((m: any) => {
            const id = m.name.replace("models/", "");
            return {
              id: id,
              name: m.displayName || id,
              value: id,
              label: m.displayName || id,
            };
          });
      }

      if (provider === "cohere") {
        if (!apiKey) return [
          { id: "command-r-plus", name: "Command R+", value: "command-r-plus", label: "Command R+" },
          { id: "command-r", name: "Command R", value: "command-r", label: "Command R+" },
        ];

        const cohere = new CohereClient({ token: apiKey });
        const data = await cohere.models.list();
        return data.models
          ?.filter((m) => m.endpoints?.includes("chat"))
          .map((m) => ({
            id: m.name ?? "",
            name: m.name ?? "",
            value: m.name ?? "",
            label: m.name ?? "",
          })) || [];
      }
    } catch (error) {
      console.error(`Error fetching models for ${provider}:`, error);
    }

    return [];
  }

  // Get system prompt based on tool
  private getSystemPrompt(tool: string): string {
    const prompts: Record<string, string> = {
      "email-writer": "You are a professional email writing assistant. Write clear, concise, and professional emails based on the user's requirements.",
      "tweet-generator": "You are a Twitter expert. Create engaging, concise tweets that capture attention and encourage interaction.",
      "grammar-checker": "You are a grammar expert. Check and correct grammar, spelling, and punctuation errors while maintaining the original meaning.",
      "sentence-builder": "You are a sentence builder expert. Convert ideas into well-structured, clear sentences.",
      "text-summarizer": "You are a text summarizer expert. Create concise summaries that capture the key points of the content.",
      "content-rewriter": "You are a content rewriter expert. Rewrite content to improve clarity, engagement, and readability.",
      "blog-generator": "You are a blog generator expert. Create engaging, well-structured blog posts with clear introductions, body content, and conclusions.",
      "caption-generator": "You are a caption generator expert. Create compelling social media captions that engage audiences and encourage interaction.",
    };
    return prompts[tool] || "You are a helpful AI assistant.";
  }

  // Generate AI content using LangChain (Client-side)
  async generate(request: GenerateRequest): Promise<GenerateResponse> {
    if (!request.prompt || !request.tool || !request.apiKey) {
      // Allow Ollama without explicit API key if handled internally or empty string
      if (request.provider !== 'ollama' && !request.apiKey) {
        return {
          success: false,
          error: "Missing prompt, tool, or API key",
        };
      }
    }

    try {
      const provider = request.provider || "openai";
      const modelName = request.model || this.getDefaultModel(provider);
      const systemPrompt = this.getSystemPrompt(request.tool);
      const temperature = request.options?.temperature ?? 0.7;
      const maxTokens = request.options?.maxTokens; // Optional

      let chatModel;

      // Instantiate LangChain model based on provider
      switch (provider) {
        case 'openai':
          chatModel = new ChatOpenAI({
            modelName: modelName,
            openAIApiKey: request.apiKey,
            temperature,
            maxTokens,
            configuration: {
              dangerouslyAllowBrowser: true // Required for client-side usage
            }
          });
          break;
        case 'anthropic':
          chatModel = new ChatAnthropic({
            modelName: modelName,
            anthropicApiKey: request.apiKey,
            temperature,
            maxTokens,
          });
          break;
        case 'google':
          chatModel = new ChatGoogleGenerativeAI({
            model: modelName,
            apiKey: request.apiKey,
            temperature,
            maxOutputTokens: maxTokens,
          });
          break;
        case 'cohere':
          chatModel = new ChatCohere({
            model: modelName,
            apiKey: request.apiKey,
            temperature,
          });
          break;
        case 'ollama':
          // For Ollama, we use ChatOpenAI with the local base URL
          // This assumes the user has configured Ollama to allow CORS or is using a proxy,
          // or sticking to the Tauri side for Ollama (which uses `streamApi` below maybe?)
          // Actually, for web, direct fetch to localhost often fails mixed content (https -> http).
          // But let's support it if the browser allows or if served from localhost.
          const host = localStorage.getItem("ollama_host") || "http://localhost:11434";
          chatModel = new ChatOpenAI({
            modelName: modelName,
            openAIApiKey: "ollama",
            temperature,
            configuration: {
              baseURL: `${host}/v1`,
              dangerouslyAllowBrowser: true,
            },
          });
          break;
        default:
          throw new Error(`Provider ${provider} not supported`);
      }

      const messages = [
        new SystemMessage(systemPrompt),
        new HumanMessage(request.prompt)
      ];

      const response = await chatModel.invoke(messages);
      const usage = response.response_metadata?.tokenUsage as any || {};

      return {
        success: true,
        content: response.content.toString(),
        provider: provider,
        model: modelName,
        usage: {
          // LangChain simplified usage mapping
          promptTokens: usage.promptTokens || 0,
          completionTokens: usage.completionTokens || 0,
          totalTokens: usage.totalTokens || 0,
        },
      };

    } catch (error: any) {
      console.error("LangChain generation error:", error);
      return {
        success: false,
        error: "Failed to generate content",
        details: error?.message || "Unknown error",
      };
    }
  }

  // Fetch Ollama models
  async fetchModels() {
    const host = localStorage.getItem("ollama_host") || "http://localhost:11434";

    try {
      if (isTauri()) {
        const res = await invoke<{ models: OllamaModel[] }>("call_api", {
          method: "GET",
          url: `${host}/api/tags`,
        });
        return { models: res.models };
      } else {
        const response = await fetch(`${host}/api/tags`);
        if (!response.ok) return { error: "Failed to fetch models" };
        const data = await response.json();
        return { models: data.models };
      }
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Unknown error" };
    }
  }

  // Check status (simplified for static export)
  async getStatus(): Promise<{
    success: boolean;
    status?: string;
    ollamaStatus?: boolean;
    providers?: string[];
    aiProviders?: Provider[];
    error?: string;
  }> {
    // Get configured providers from localStorage
    const configuredProviders = Object.keys(localStorage)
      .filter((key) => key.startsWith("api_key_"))
      .map((key) => key.replace("api_key_", ""));

    // Fetch models for each configured provider (using static lists)
    const providerConfigs = [
      { label: "OpenAI", value: "openai" },
      { label: "Anthropic Claude", value: "anthropic" },
      { label: "Google Gemini", value: "google" },
      { label: "Cohere", value: "cohere" },
    ];

    const aiProviders: Provider[] = await Promise.all(providerConfigs
      .filter((p) => configuredProviders.includes(p.value))
      .map(async (providerConfig) => {
        const models = await this.getProviderModels(providerConfig.value);
        return {
          ...providerConfig,
          models,
        };
      }));

    const providers = aiProviders.map((p) => p.value);
    const errorMessages: string[] = [];
    let ollamaStatus: boolean | undefined = undefined;
    const host = localStorage.getItem("ollama_host") || "http://localhost:11434";

    // Check Ollama status
    if (isTauri()) {
      try {
        const res = await invoke<string>("call_api", {
          method: "GET",
          url: host, // Just check if reachable
        });
        ollamaStatus = !!res;
      } catch (err) {
        // errorMessages.push("Failed to fetch Ollama host via Tauri"); // Optional to log
      }
    } else {
      try {
        const resp = await fetch(host);
        ollamaStatus = resp.ok;
      } catch {
        // Often fails due to CORS or mixed content if not configured
      }
    }

    if (ollamaStatus) {
      const ollamaModels = await this.fetchModels();
      if ('models' in ollamaModels && ollamaModels.models) {
        const mappedModels: Model[] = ollamaModels.models.map((m: OllamaModel) => ({
          id: m.name,
          name: m.name,
          value: m.name,
          label: m.name,
          description: m.details?.parameter_size || "",
        }));

        aiProviders.push({
          label: "Ollama (Local)",
          value: "ollama",
          models: mappedModels
        });
        providers.push("ollama");
      }
    }

    return {
      success: true, // Always true for client-side as we don't depend on backend status
      status: "online",
      ollamaStatus,
      providers,
      aiProviders,
      error: errorMessages.length > 0 ? errorMessages.join("; ") : undefined,
    };
  }

  // Stream API for real-time responses (Tauri only - kept for compatibility)
  streamApi(
    method: string,
    url: string,
    headers?: Record<string, string>,
    body?: string
  ): ReadableStream<Uint8Array> {
    const streamId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return new ReadableStream({
      async start(controller) {
        const { listen } = await import("@tauri-apps/api/event");

        const unlistenChunk = await listen<{ chunk: string }>(
          `stream-chunk-${streamId}`,
          (event) => {
            const chunk = event.payload.chunk;
            controller.enqueue(new TextEncoder().encode(chunk));
          }
        );

        const unlistenError = await listen<{ error: string }>(
          `stream-error-${streamId}`,
          (event) => {
            console.error("Stream error:", event.payload.error);
            controller.error(new Error(event.payload.error));
            unlistenChunk();
            unlistenError();
            unlistenComplete();
          }
        );

        const unlistenComplete = await listen<{ done: boolean }>(
          `stream-complete-${streamId}`,
          () => {
            controller.close();
            unlistenChunk();
            unlistenError();
            unlistenComplete();
          }
        );

        try {
          await invoke("stream_api", {
            streamId,
            method,
            url,
            headers: headers ? JSON.stringify(headers) : undefined,
            body,
          });
        } catch (error) {
          console.error("Failed to start stream:", error);
          controller.error(error);
          unlistenChunk();
          unlistenError();
          unlistenComplete();
        }
      },
    });
  }
}

export const apiClient = new APIClient();
