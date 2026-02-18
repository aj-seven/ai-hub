export interface GenerateRequest {
  prompt: string;
  tool: string;
  options?: {
    tone?: string;
    style?: string;
    length?: string;
    platform?: string;
    maxTokens?: number;
    temperature?: number;
  };
  provider?: string;
  model?: string;
  apiKey?: string;
}

export interface GenerateResponse {
  success: boolean;
  content?: string;
  provider?: string;
  model?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  error?: string;
  details?: string;
}

export type Provider = {
  value: string;
  label: string;
  models?: Model[];
};

export type Model = {
  id: string;
  name: string;
  description?: string;
  value?: string;
  label?: string;
};

export interface OllamaModel {
  name: string;
  description?: string;
  [key: string]: any;
}
