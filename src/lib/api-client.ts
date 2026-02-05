import {
  GenerateRequest,
  GenerateResponse,
  Provider,
} from "@/types/api-client";
import { invoke, isTauri } from "@tauri-apps/api/core";

export type OllamaModel = {
  name: string;
  description?: string;
  [key: string]: any;
};

class APIClient {
  // Generate AI content
  async generate(request: GenerateRequest): Promise<GenerateResponse> {
    if (!request.prompt || !request.tool || !request.apiKey) {
      return {
        success: false,
        error: "Missing prompt, tool, or API key",
      };
    }

    const body: GenerateRequest = {
      ...request,
      options: {
        ...request.options,
        maxTokens: request.options?.maxTokens ?? 1000,
        temperature: request.options?.temperature ?? 0.7,
      },
    };

    const host = localStorage.getItem("ollama_host");
    if (!host) {
      return {
        success: false,
        error: "Ollama host not set in localStorage",
      };
    }

    const url = `${host}/api/generate`;

    if (isTauri()) {
      try {
        const response = await invoke<GenerateResponse>("call_api", {
          method: "POST",
          url,
          headers: JSON.stringify({ "Content-Type": "application/json" }),
          body: JSON.stringify(body),
        });
        return response;
      } catch (error) {
        console.error("Tauri call_api error:", error);
        return {
          success: false,
          error: "Failed to call generate API via Tauri",
          details: error instanceof Error ? error.message : "Unknown error",
        };
      }
    } else {
      try {
        const resp = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!resp.ok) {
          const errData = await resp.json();
          return {
            success: false,
            error: errData.error || "API request failed",
            details: errData.details,
          };
        }

        const data: GenerateResponse = await resp.json();
        return data;
      } catch (err) {
        return {
          success: false,
          error: "Failed to call generate API in web environment",
          details: err instanceof Error ? err.message : "Unknown error",
        };
      }
    }
  }

  // Fetch Ollama models
  async fetchModels() {
    const host = localStorage.getItem("ollama_host");
    if (!host) return { error: "Ollama host not set in localStorage" };

    try {
      if (isTauri()) {
        const res = await invoke<{ models: OllamaModel[] }>("call_api", {
          method: "GET",
          url: `${host}/api/tags`,
        });
        console.log(res);

        return { models: res.models };
      } else {
        const response = await fetch(`${host}/api/tags`);
        if (!response.ok) return { error: "Failed to fetch models" };
        const data = await response.json();
        console.log(data);

        return { models: data.models };
      }
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Unknown error" };
    }
  }

  // Check backend /api and Ollama host status
  async getStatus(): Promise<{
    success: boolean;
    status?: string;
    ollamaStatus?: boolean;
    providers?: string[];
    aiProviders?: Provider[];
    error?: string;
  }> {
    const aiProviders: Provider[] = [
      { label: "OpenAI", value: "openai" },
      { label: "Anthropic Claude", value: "anthropic" },
      { label: "Google Gemini", value: "google" },
      { label: "Cohere", value: "cohere" },
    ];

    const providers = Object.keys(localStorage)
      .filter((key) => key.startsWith("api_key_"))
      .map((key) => key.replace("api_key_", ""))
      .filter((p) => aiProviders.map((a) => a.value).includes(p));

    const errorMessages: string[] = [];
    let status: string | undefined = undefined;
    let ollamaStatus: boolean | undefined = undefined;

    const host = localStorage.getItem("ollama_host");

    if (isTauri()) {
      try {
        const res = await invoke<{ status: string }>("call_api", {
          method: "GET",
          url: `${host}/api/version`,
        });
        status = (res as any).status;
      } catch (err) {
        errorMessages.push("Failed to get /api/status via Tauri");
      }

      if (host) {
        try {
          const res = await invoke<string>("call_api", {
            method: "GET",
            url: host,
          });
          ollamaStatus = !!res;
        } catch (err) {
          errorMessages.push("Failed to fetch Ollama host via Tauri");
        }
      } else {
        errorMessages.push("Ollama host not set in localStorage");
      }
    } else {
      try {
        const resp = await fetch("/api/status");
        if (resp.ok) {
          const data = await resp.json();
          status = data.status;
        } else {
          errorMessages.push("Failed to fetch /api/status in web");
        }
      } catch {
        errorMessages.push("Failed to fetch /api/status in web");
      }

      if (host) {
        try {
          const resp = await fetch(host);
          ollamaStatus = resp.ok;
        } catch {
          errorMessages.push("Failed to fetch Ollama host in web");
        }
      } else {
        errorMessages.push("Ollama host not set in localStorage");
      }
    }

    return {
      success: errorMessages.length === 0,
      status,
      ollamaStatus,
      providers,
      aiProviders,
      error: errorMessages.length > 0 ? errorMessages.join("; ") : undefined,
    };
  }

  // Stream API for real-time responses (Tauri only)
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

        // Listen for chunks
        const unlistenChunk = await listen<{ chunk: string }>(
          `stream-chunk-${streamId}`,
          (event) => {
            const chunk = event.payload.chunk;
            controller.enqueue(new TextEncoder().encode(chunk));
          }
        );

        // Listen for errors
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

        // Listen for completion
        const unlistenComplete = await listen<{ done: boolean }>(
          `stream-complete-${streamId}`,
          () => {
            controller.close();
            unlistenChunk();
            unlistenError();
            unlistenComplete();
          }
        );

        // Start the stream
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
