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
      switch (provider) {
        case "openai": return await this.getOpenAIModels(apiKey);
        case "anthropic": return await this.getAnthropicModels(apiKey);
        case "google": return await this.getGoogleModels(apiKey);
        case "cohere": return await this.getCohereModels(apiKey);
      }
    } catch (error) {
      console.error(`Error fetching models for ${provider}:`, error);
    }

    return [];
  }

  private async getOpenAIModels(apiKey: string | null): Promise<Model[]> {
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
        provider: 'cloud',
      }));
  }

  private async getAnthropicModels(apiKey: string | null): Promise<Model[]> {
    if (!apiKey) return [
      { id: "claude-3-5-sonnet-latest", name: "Claude 3.5 Sonnet", value: "claude-3-5-sonnet-latest", label: "Claude 3.5 Sonnet", provider: 'cloud' },
      { id: "claude-3-7-sonnet-latest", name: "Claude 3.7 Sonnet", value: "claude-3-7-sonnet-latest", label: "Claude 3.7 Sonnet", provider: 'cloud' },
    ];

    try {
      const anthropic = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
      const data = await anthropic.models.list();
      return data.data.map((m) => ({
        id: m.id,
        name: m.display_name || m.id,
        value: m.id,
        label: m.display_name || m.id,
        provider: 'cloud',
      }));
    } catch (e) {
      console.warn("Failed to fetch Anthropic models, using fallback", e);
    }

    return [
      { id: "claude-3-7-sonnet-20250219", name: "Claude 3.7 Sonnet", value: "claude-3-7-sonnet-20250219", label: "Claude 3.7 Sonnet", provider: 'cloud' },
      { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet", value: "claude-3-5-sonnet-20241022", label: "Claude 3.5 Sonnet", provider: 'cloud' },
      { id: "claude-3-opus-20240229", name: "Claude 3 Opus", value: "claude-3-opus-20240229", label: "Claude 3 Opus", provider: 'cloud' },
      { id: "claude-3-sonnet-20240229", name: "Claude 3 Sonnet", value: "claude-3-sonnet-20240229", label: "Claude 3 Sonnet", provider: 'cloud' },
      { id: "claude-3-haiku-20240307", name: "Claude 3 Haiku", value: "claude-3-haiku-20240307", label: "Claude 3 Haiku", provider: 'cloud' },
    ];
  }

  private async getGoogleModels(apiKey: string | null): Promise<Model[]> {
    if (!apiKey) return [
      { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", value: "gemini-1.5-pro", label: "Gemini 1.5 Pro", provider: 'cloud' },
      { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", value: "gemini-1.5-flash", label: "Gemini 1.5 Flash", provider: 'cloud' },
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
          provider: 'cloud',
        };
      });
  }

  private async getCohereModels(apiKey: string | null): Promise<Model[]> {
    if (!apiKey) return [
      { id: "command-r-plus", name: "Command R+", value: "command-r-plus", label: "Command R+", provider: 'cloud' },
      { id: "command-r", name: "Command R", value: "command-r", label: "Command R+", provider: 'cloud' },
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
        provider: 'cloud',
      })) || [];
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
      "chat-title": "You are a helpful assistant. Generate a very short, concise title (max 4 words) for a chat based on the user message. Do not use quotes, prefixes, or punctuation. Just the title.",
    };
    return prompts[tool] || "You are a helpful AI assistant.";
  }

  // Generate AI content using LangChain (Client-side)
  async generate(request: GenerateRequest): Promise<GenerateResponse> {
    if (!request.prompt || !request.tool || !request.apiKey) {
      // Allow Ollama without explicit API key if handled internally or empty string
      if (request.provider !== 'ollama' && request.provider !== 'ollama-local' && request.provider !== 'ollama-cloud' && !request.apiKey) {
        return {
          success: false,
          error: "Missing prompt, tool, or API key",
        };
      }
    }

    try {
      const initialProvider = request.provider || "openai";
      let modelName = request.model || this.getDefaultModel(initialProvider);
      let provider = initialProvider;

      // Auto-detect provider from model ID if it's complex (e.g. "ollama-cloud:llama3")
      if (modelName.includes(':') && (modelName.startsWith('ollama-') || modelName.startsWith('openai:'))) {
        const parts = modelName.split(':');
        provider = parts[0];
        modelName = parts.slice(1).join(':');
      }

      const systemPrompt = this.getSystemPrompt(request.tool);
      const temperature = request.options?.temperature ?? 0.7;
      const maxTokens = request.options?.maxTokens; // Optional

      let chatModel;

      // Instantiate LangChain model based on provider
      switch (provider) {
        case 'openai':
          chatModel = new ChatOpenAI({
            modelName: modelName,
            apiKey: request.apiKey,
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
        case 'ollama-local':
        case 'ollama-cloud':
          return await this.generateOllama(request, modelName, systemPrompt, { temperature, maxTokens, provider });
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

  // Native Ollama Generation
  private async generateOllama(
    request: GenerateRequest,
    modelName: string,
    systemPrompt: string,
    options: { temperature: number; maxTokens?: number; provider: string }
  ): Promise<GenerateResponse> {
    const localHost = localStorage.getItem("ollama_host") || "http://localhost:11434";
    const ollamaApiKey = request.apiKey || localStorage.getItem("ollama_api_key");

    // Determine mode
    let ollamaMode: "local" | "cloud" = "local";
    if (options.provider === 'ollama-cloud') ollamaMode = 'cloud';
    else if (options.provider === 'ollama-local') ollamaMode = 'local';
    else {
      const stored = localStorage.getItem("selected_ollama_service") || localStorage.getItem("ollama_mode");
      ollamaMode = stored === 'cloud' ? 'cloud' : 'local';
    }

    const host = ollamaMode === 'cloud' ? 'https://ollama.com' : localHost;
    const apiKey = ollamaApiKey || "ollama";
    const url = `${host}/api/chat`;

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (ollamaMode === 'cloud' && apiKey) {
      headers["Authorization"] = `Bearer ${apiKey}`;
    }

    const payload = {
      model: modelName,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: request.prompt }
      ],
      stream: false,
      options: {
        temperature: options.temperature,
        num_predict: options.maxTokens,
      }
    };

    let result;
    if (isTauri()) {
      result = await invoke<any>("call_api", {
        method: "POST",
        url: url,
        headers: JSON.stringify(headers),
        body: JSON.stringify(payload),
      });
    } else {
      const res = await fetch(url, {
        method: "POST",
        headers: headers as any,
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Ollama error: ${res.status}`);
      result = await res.json();
    }

    return {
      success: true,
      content: result.message?.content || result.response || "",
      provider: options.provider,
      model: modelName,
      usage: {
        promptTokens: result.prompt_eval_count || 0,
        completionTokens: result.eval_count || 0,
        totalTokens: (result.prompt_eval_count || 0) + (result.eval_count || 0),
      },
    };
  }

  // Fetch Ollama models
  async fetchModels(specifiedProvider?: 'local' | 'cloud') {
    const mode = specifiedProvider || localStorage.getItem("ollama_mode") || "local";
    let localHost = localStorage.getItem("ollama_host") || "http://localhost:11434";

    if (localHost.includes("ollama.com")) {
      localHost = "http://localhost:11434";
    }

    const host = mode === "cloud" ? "https://ollama.com" : localHost;
    const apiKey = localStorage.getItem("ollama_api_key");

    const url = `${host}/api/tags`;
    const headers = mode === "cloud" && apiKey ? { "Authorization": `Bearer ${apiKey}` } : undefined;

    if (mode === "cloud" && !apiKey) {
      return { error: "No API key configured for Ollama Cloud." };
    }

    try {
      if (isTauri()) {
        const res = await invoke<any>("call_api", {
          method: "GET",
          url: url,
          headers: headers ? JSON.stringify(headers) : undefined,
        });

        if (res && res.raw && typeof res.raw === 'string' && res.raw.includes('<!DOCTYPE html>')) {
          console.error("fetchModels: Received HTML response", res.raw.substring(0, 200));
          return { error: "Cloud host returned a web page instead of API data." };
        }

        return { models: res?.models || [] };
      } else {
        const response = await fetch(url, { headers: headers as any });
        if (!response.ok) {
          const text = await response.text();
          return { error: `HTTP ${response.status}: ${text.substring(0, 100)}` };
        }
        const data = await response.json();
        return { models: data.models || [] };
      }
    } catch (err: any) {
      if (!url.includes("localhost")) {
        console.error(`fetchModels error for ${url}:`, err);
      }
      const msg = typeof err === 'string' ? err : (err?.message || "Request failed");
      return { error: msg };
    }
  }

  // Check status
  async getStatus(): Promise<{
    success: boolean;
    status?: string;
    ollamaStatus?: boolean;
    providers?: string[];
    aiProviders?: Provider[];
    error?: string;
  }> {
    const configuredProviders = Object.keys(localStorage)
      .filter((key) => key.startsWith("api_key_"))
      .map((key) => key.replace("api_key_", ""));

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
        return { ...providerConfig, models };
      }));

    const providers = aiProviders.map((p) => p.value);
    const errorMessages: string[] = [];

    const fetchProviderModels = async (p: 'local' | 'cloud') => {
      const ollamaModels = await this.fetchModels(p);

      if (ollamaModels && 'models' in ollamaModels && Array.isArray(ollamaModels.models)) {
        const mappedModels: Model[] = ollamaModels.models.map((m: OllamaModel) => ({
          id: `ollama-${p}:${m.name}`,
          name: m.name,
          value: `ollama-${p}:${m.name}`,
          label: m.name,
          description: m.details?.parameter_size || "",
          provider: p,
          size: m.size
        }));

        aiProviders.push({
          label: p === "cloud" ? "Ollama Cloud" : "Ollama (Local)",
          value: `ollama-${p}`,
          models: mappedModels
        });
        providers.push(`ollama-${p}`);
        return true;
      } else if (ollamaModels && 'error' in ollamaModels) {
        if (!(p === 'cloud' && ollamaModels.error?.includes("No API key"))) {
          errorMessages.push(`${p}: ${ollamaModels.error}`);
        }
        return false;
      }
      return false;
    };

    const selectedService = localStorage.getItem("selected_ollama_service") || localStorage.getItem("ollama_mode") || "local";
    const [localAvailable, cloudAvailable] = await Promise.all([
      fetchProviderModels('local'),
      fetchProviderModels('cloud')
    ]);

    return {
      success: true,
      status: "online",
      ollamaStatus: selectedService === 'cloud' ? cloudAvailable : localAvailable,
      providers,
      aiProviders,
      error: errorMessages.length > 0 ? errorMessages.join("; ") : undefined,
    };
  }

  // Stream API (Tauri only)
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

        const unlistenChunk = await listen<{ chunk: string }>(`stream-chunk-${streamId}`, (event) => {
          controller.enqueue(new TextEncoder().encode(event.payload.chunk));
        });

        const unlistenError = await listen<{ error: string }>(`stream-error-${streamId}`, (event) => {
          console.error("Stream error:", event.payload.error);
          controller.error(new Error(event.payload.error));
          cleanup();
        });

        const unlistenComplete = await listen<{ done: boolean }>(`stream-complete-${streamId}`, () => {
          controller.close();
          cleanup();
        });

        const cleanup = () => {
          unlistenChunk();
          unlistenError();
          unlistenComplete();
        };

        try {
          await invoke("stream_api", { streamId, method, url, headers: headers ? JSON.stringify(headers) : undefined, body });
        } catch (error) {
          console.error("Failed to start stream:", error);
          controller.error(error);
          cleanup();
        }
      },
    });
  }
}

export const apiClient = new APIClient();
