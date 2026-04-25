"use client";

import { useEffect, useState } from "react";

import { ChatSidebar } from "./_components/ChatSidebar";
import { ChatMessages } from "./_components/ChatMessages";
import { ChatInput } from "./_components/ChatInput";
import { ProjectView } from "./_components/ProjectView";
import { Project, Chat, Message } from "@/types/chat";
import { apiClient } from "@/lib/api-client";
import { Model } from "@/types/api-client";
import { isTauri, invoke } from "@tauri-apps/api/core";

export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatingTitle, setGeneratingTitle] = useState(false);
  const [abortCtrl, setAbortCtrl] = useState<AbortController | null>(null);
  const [model, setModel] = useState<string>("");
  const [modelList, setModelList] = useState<Model[]>([]);

  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [editingTitleVal, setEditingTitleVal] = useState("");

  const [systemPrompt, setSystemPrompt] = useState<string>(
    "You are a helpful assistant."
  );
  const [apiStatus, setApiStatus] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string>("");

  useEffect(() => {
    const loadFromLocalStorage = async () => {
      const stored = localStorage.getItem("systemMessage");
      if (stored) {
        setSystemPrompt(stored);
      }

      const savedChats = localStorage.getItem("savedChats");
      if (savedChats) {
        const data: Chat[] = JSON.parse(savedChats);
        setChats(data);
      }

      const savedProjects = localStorage.getItem("savedProjects");
      if (savedProjects) {
        const data: Project[] = JSON.parse(savedProjects);
        setProjects(data);
      }
    };

    loadFromLocalStorage();
  }, []);

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await apiClient.getStatus();
        setApiStatus(response.ollamaStatus ? "online" : "offline");
        setApiError(response.error || "");
      } catch (err: any) {
        setApiStatus("offline");
        setApiError(typeof err === 'string' ? err : err?.message || "Unknown error");
      }
    };

    checkApiStatus();

    // Listen for storage changes to refresh status
    const handleStorageChange = (e: Event | StorageEvent) => {
      if (e instanceof StorageEvent) {
        if (["ollama_mode", "ollama_host", "ollama_api_key", "selected_ollama_service"].includes(e.key || "")) {
          checkApiStatus();
        }
      } else {
        checkApiStatus();
      }
    };

    window.addEventListener("storage", handleStorageChange as any);
    window.addEventListener("storage_sync", handleStorageChange as any);
    return () => {
      window.removeEventListener("storage", handleStorageChange as any);
      window.removeEventListener("storage_sync", handleStorageChange as any);
    };
  }, []);

  // Helpers
  const saveChats = (list: Chat[]) => {
    setChats(list);
    localStorage.setItem("savedChats", JSON.stringify(list));
  };

  const saveProjects = (list: Project[]) => {
    setProjects(list);
    localStorage.setItem("savedProjects", JSON.stringify(list));
  };

  const selectChat = (id: string) => {
    const chat = chats.find((c) => c.id === id);
    if (chat) {
      setCurrentChatId(id);
      setMessages(chat.messages);
      // If chat belongs to a project, ensure we select that project?
      // Or maybe we don't force it, but usually this is called from sidebar where context is known.
    }
  };

  const selectProject = (id: string | null) => {
    setSelectedProjectId(id);
    setCurrentChatId(null);
    setMessages([]);
  };

  const createChat = () => {
    const newChat: Chat = {
      id: crypto.randomUUID(),
      title: "New Chat",
      messages: [],
      type: "chat",
      projectId: selectedProjectId || undefined,
    };
    const updatedChats = [newChat, ...chats];
    saveChats(updatedChats);
    selectChat(newChat.id);
  };

  const createProject = (name: string) => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      title: name,
      createdAt: Date.now(),
    };
    const updatedProjects = [newProject, ...projects];
    saveProjects(updatedProjects);
    // Optionally auto-select the new project
    // selectProject(newProject.id);
  };

  const deleteChat = (id: string) => {
    const updated = chats.filter((c) => c.id !== id);
    saveChats(updated);
    if (id === currentChatId) {
      // Try to find another chat only within current context if possible,
      // but for simplicity just clear selection for now or pick first available
      const remainingInContext = updated.filter((c) =>
        selectedProjectId ? c.projectId === selectedProjectId : !c.projectId
      );

      if (remainingInContext.length > 0) selectChat(remainingInContext[0].id);
      else {
        setCurrentChatId(null);
        setMessages([]);
      }
    }
  };

  const deleteProject = (id: string) => {
    // Delete project
    const updatedProjects = projects.filter((p) => p.id !== id);
    saveProjects(updatedProjects);

    // Delete chats associated with project
    const updatedChats = chats.filter((c) => c.projectId !== id);
    saveChats(updatedChats);

    if (selectedProjectId === id) {
      selectProject(null);
    }
  };

  const updateChatMessages = (msgs: Message[]) => {
    setMessages(msgs);
    const updated = chats.map((c) =>
      c.id === currentChatId ? { ...c, messages: msgs } : c
    );
    saveChats(updated);
  };

  const updateChatTitle = () => {
    if (!editingTitleId) return;
    const updated = chats.map((c) =>
      c.id === editingTitleId
        ? { ...c, title: editingTitleVal || "Untitled" }
        : c
    );
    saveChats(updated);
    setEditingTitleId(null);
  };

  const generateTitle = async (chatId: string, firstMessage: string) => {
    setGeneratingTitle(true);
    try {
      const selectedModelData = modelList.find(m => m.id === model);
      let providerBase = selectedModelData?.provider || 'openai';

      // Map provider base for apiClient.generate
      let finalProvider = providerBase;
      if (model.startsWith('ollama-local')) finalProvider = 'ollama-local';
      else if (model.startsWith('ollama-cloud')) finalProvider = 'ollama-cloud';
      else if (model.startsWith('gpt-') || model.includes('openai')) finalProvider = 'openai';
      else if (model.startsWith('claude-') || model.includes('anthropic')) finalProvider = 'anthropic';
      else if (model.startsWith('gemini') || model.includes('google')) finalProvider = 'google';
      else if (model.includes('cohere')) finalProvider = 'cohere';

      const apiKey = finalProvider.startsWith('ollama')
        ? (localStorage.getItem("ollama_api_key") || "")
        : (localStorage.getItem(`api_key_${finalProvider}`) || "");

      const res = await apiClient.generate({
        prompt: firstMessage,
        tool: 'chat-title',
        provider: finalProvider,
        model: model,
        apiKey: apiKey,
      });

      if (res.success && res.content) {
        const title = res.content.trim().replace(/^["']|["']$/g, "");
        if (title) {
          setChats((prevChats) => {
            const updated = prevChats.map((c) =>
              c.id === chatId ? { ...c, title } : c
            );
            localStorage.setItem("savedChats", JSON.stringify(updated));
            return updated;
          });
        }
      }
    } catch (error) {
      console.error("Failed to generate title:", error);
    } finally {
      setGeneratingTitle(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !model) return;

    let activeChatId = currentChatId;
    let isNewChat = false;

    // Auto-create chat if none selected
    if (!activeChatId) {
      isNewChat = true;
      activeChatId = crypto.randomUUID();
      const newChat: Chat = {
        id: activeChatId,
        title: "New Chat",
        messages: [],
        type: "chat",
        projectId: selectedProjectId || undefined,
      };
      setChats((prev) => {
        const updated = [newChat, ...prev];
        localStorage.setItem("savedChats", JSON.stringify(updated));
        return updated;
      });
      setCurrentChatId(activeChatId);
    }

    const ctrl = new AbortController();
    setAbortCtrl(ctrl);

    const userMsg: Message = { role: "user", content: input };
    const assistantMsg: Message = { role: "assistant", content: "" };

    // Optimistic update
    const newMsgs = [...messages, userMsg, assistantMsg];
    setMessages(newMsgs);

    // Update chat history helper that accepts ID
    const updateHistory = (msgs: Message[]) => {
      setChats((prev) => {
        const updated = prev.map((c) =>
          c.id === activeChatId ? { ...c, messages: msgs } : c
        );
        localStorage.setItem("savedChats", JSON.stringify(updated));
        return updated;
      });
    };
    updateHistory(newMsgs);

    const systemMessage: Message = {
      role: "system",
      content: systemPrompt,
    };

    const finalMessages = [systemMessage, ...messages, userMsg];

    setInput("");
    setLoading(true);

    const selectedModelData = modelList.find(m => m.id === model);
    const provider = selectedModelData?.provider || 'local';
    const modelName = selectedModelData?.name || model;

    const localHost = localStorage.getItem("ollama_host") || "http://localhost:11434";
    const apiKey = localStorage.getItem("ollama_api_key");

    const host = provider === 'cloud' ? 'https://ollama.com' : localHost;
    const url = `${host}/api/chat`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (provider === 'cloud' && apiKey) {
      headers["Authorization"] = `Bearer ${apiKey}`;
    }

    try {
      let reader: ReadableStreamDefaultReader<Uint8Array>;

      // TAURI VERSION
      if (isTauri()) {
        const payload = {
          model: modelName,
          messages: finalMessages,
          stream: true,
          host,
        };

        const stream = apiClient.streamApi(
          "POST",
          url,
          headers,
          JSON.stringify(payload)
        );

        reader = stream.getReader();
      } else {
        // WEB VERSION
        const res = await fetch(url, {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            model: modelName,
            messages: finalMessages,
            stream: true,
          }),
          signal: ctrl.signal,
        });

        if (!res.ok || !res.body) {
          throw new Error(`Request failed with status ${res.status}`);
        }

        reader = res.body.getReader();
      }

      // SHARED JSONL STREAM PARSER
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      let lastUpdate = Date.now();
      // Mutable response for streaming
      let currentAssistantMessage = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        let contentUpdated = false;
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          try {
            const json = JSON.parse(trimmed);
            if (json.message?.content) {
              currentAssistantMessage += json.message.content;
              contentUpdated = true;
            }
          } catch { }
        }

        const now = Date.now();
        if (contentUpdated && now - lastUpdate > 32) {
          const updatedMsgs = [
            ...messages,
            userMsg,
            { ...assistantMsg, content: currentAssistantMessage },
          ];
          setMessages(updatedMsgs);
          // We generally don't save to LS on every frame, but we should update state
          lastUpdate = now;
        }
      }

      // Handle any remaining buffer
      if (buffer.trim()) {
        try {
          const json = JSON.parse(buffer.trim());
          if (json.message?.content) {
            currentAssistantMessage += json.message.content;
          }
        } catch { }
      }

      const finalMsgs = [
        ...messages,
        userMsg,
        { ...assistantMsg, content: currentAssistantMessage },
      ];
      setMessages(finalMsgs);
      updateHistory(finalMsgs);

      // Auto-generate title if it was a new chat or first message
      if (isNewChat || messages.length === 0) {
        generateTitle(activeChatId!, input);
      }
    } catch (err) {
      console.error(err);
      const errorMsgs = [
        ...messages,
        userMsg,
        {
          ...assistantMsg,
          content: assistantMsg.content + "\n⚠️ Error or aborted.",
        },
      ];
      setMessages(errorMsgs);
      updateHistory(errorMsgs);
    } finally {
      setLoading(false);
    }
  };

  const stopStream = () => {
    abortCtrl?.abort();
    setLoading(false);
  };

  // Helpers
  const currentProject = projects.find((p) => p.id === selectedProjectId);
  const projectChats = selectedProjectId
    ? chats.filter((c) => c.projectId === selectedProjectId)
    : [];
  const isProjectDashboard = selectedProjectId && !currentChatId;

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] w-full overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-[280px] flex-col border-r bg-muted/10 shrink-0 h-full transition-all duration-300 ease-in-out">
        <ChatSidebar
          chats={chats}
          projects={projects}
          currentChatId={currentChatId}
          selectedProjectId={selectedProjectId}
          selectChat={(id: string) => {
            selectChat(id);
          }}
          selectProject={selectProject}
          createChat={createChat}
          createProject={createProject}
          deleteChat={deleteChat}
          deleteProject={deleteProject}
          editingTitleId={editingTitleId}
          setEditingTitleId={setEditingTitleId}
          editingTitleVal={editingTitleVal}
          setEditingTitleVal={setEditingTitleVal}
          updateChatTitle={updateChatTitle}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 h-full min-w-0 relative bg-background/50">
        {isProjectDashboard && currentProject ? (
          <ProjectView
            project={currentProject}
            chats={projectChats}
            onCreateChat={createChat}
            onSelectChat={selectChat}
          />
        ) : (
          <>
            <ChatMessages
              messages={messages}
              apiStatus={apiStatus}
              apiError={apiError}
              loading={loading}
            />

            <ChatInput
              setModel={setModel}
              input={input}
              setInput={setInput}
              loading={loading}
              onSend={sendMessage}
              stopStream={stopStream}
              systemMessage={systemPrompt}
              setSystemMessage={setSystemPrompt}
              apiStatus={apiStatus}
              onModelDataUpdate={setModelList}
              sidebarProps={{
                chats,
                projects,
                currentChatId,
                selectedProjectId,
                selectChat,
                selectProject,
                createChat,
                createProject,
                deleteChat,
                deleteProject,
                editingTitleId,
                setEditingTitleId,
                editingTitleVal,
                setEditingTitleVal,
                updateChatTitle,
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
