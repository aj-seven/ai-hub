"use client";

import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { ChatMessages } from "./_components/ChatMessages";
import { ChatInput } from "./_components/ChatInput";
import { Chat, Message } from "@/types/chat";
import { apiClient } from "@/lib/api-client";

export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [abortCtrl, setAbortCtrl] = useState<AbortController | null>(null);
  const [model, setModel] = useState<string>("");

  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [editingTitleVal, setEditingTitleVal] = useState("");

  const [systemPrompt, setSystemPrompt] = useState<string>(
    "You are a helpful assistant."
  );
  const [apiStatus, setApiStatus] = useState<string | null>(null);

  useEffect(() => {
    const loadFromLocalStorage = async () => {
      const stored = localStorage.getItem("systemMessage");
      if (stored) {
        setSystemPrompt(stored);
      }

      const saved = localStorage.getItem("savedChats");
      if (saved) {
        const data: Chat[] = JSON.parse(saved);
        setChats(data);
        if (data.length > 0) {
          setCurrentChatId(data[0].id);
          setMessages(data[0].messages);
        }
      }
    };

    loadFromLocalStorage();
  }, []);

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await apiClient.getStatus();
        setApiStatus(response.ollamaStatus ? "online" : "offline");
      } catch {
        setApiStatus("offline");
      }
    };

    checkApiStatus();
  }, []);

  // Helpers
  const saveChats = (list: Chat[]) => {
    setChats(list);
    localStorage.setItem("savedChats", JSON.stringify(list));
  };

  const selectChat = (id: string) => {
    const chat = chats.find((c) => c.id === id);
    if (chat) {
      setCurrentChatId(id);
      setMessages(chat.messages);
    }
  };

  const createChat = () => {
    const newChat: Chat = { id: nanoid(), title: "New Chat", messages: [] };
    const updatedChats = [newChat, ...chats];
    saveChats(updatedChats);
    selectChat(newChat.id);
  };

  const deleteChat = (id: string) => {
    const updated = chats.filter((c) => c.id !== id);
    saveChats(updated);
    if (id === currentChatId) {
      if (updated.length > 0) selectChat(updated[0].id);
      else {
        setCurrentChatId(null);
        setMessages([]);
      }
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

  const sendMessage = async () => {
    if (!input.trim() || !currentChatId || !model) return;

    const ctrl = new AbortController();
    setAbortCtrl(ctrl);

    const userMsg: Message = { role: "user", content: input };
    const assistantMsg: Message = { role: "assistant", content: "" };
    const newMsgs = [...messages, userMsg, assistantMsg];

    const systemMessage: Message = {
      role: "system",
      content: systemPrompt || "You are a helpful assistant.",
    };

    const finalMessages = [systemMessage, ...messages, userMsg];

    updateChatMessages(newMsgs);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          messages: finalMessages,
          stream: true,
          host: localStorage.getItem("ollama_host"),
        }),
        signal: ctrl.signal,
      });

      if (!res.ok || !res.body) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");

        // Keep the last partial line in buffer
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          try {
            const json = JSON.parse(trimmed);
            if (json.message?.content) {
              assistantMsg.content += json.message.content;
              updateChatMessages([...messages, userMsg, assistantMsg]);
            }
          } catch (err) {
            console.warn("Failed to parse JSON line:", trimmed, err);
          }
        }
      }

      // Handle any remaining buffer
      if (buffer.trim()) {
        try {
          const json = JSON.parse(buffer.trim());
          if (json.message?.content) {
            assistantMsg.content += json.message.content;
            updateChatMessages([...messages, userMsg, assistantMsg]);
          }
        } catch (err) {
          console.warn("Failed to parse final buffer chunk:", buffer, err);
        }
      }
    } catch (err) {
      console.error(err);
      assistantMsg.content += "\n⚠️ Error or aborted.";
      updateChatMessages([...messages, userMsg, assistantMsg]);
    } finally {
      setLoading(false);
    }
  };

  const stopStream = () => {
    abortCtrl?.abort();
    setLoading(false);
  };

  return (
    <div className="flex max-w-7xl mx-auto flex-col min-h-screen bg-background">
      <ChatMessages
        messages={messages}
        apiStatus={apiStatus}
        loading={loading}
      />

      <ChatInput
        setModel={setModel}
        input={input}
        setInput={setInput}
        loading={loading}
        onSend={sendMessage}
        stopStream={stopStream}
        setSystemMessage={setSystemPrompt}
        apiStatus={apiStatus}
        sidebarProps={{
          chats,
          currentChatId,
          selectChat,
          createChat,
          deleteChat,
          editingTitleId,
          setEditingTitleId,
          editingTitleVal,
          setEditingTitleVal,
          updateChatTitle,
        }}
      />
    </div>
  );
}
