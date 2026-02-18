export type Role = "user" | "assistant" | "system";

export type Message = {
  role: Role;
  content: string;
  timestamp?: string;
};

export type Project = {
  id: string;
  title: string;
  createdAt: number;
};

export type Chat = {
  id: string;
  title: string;
  messages: Message[];
  type?: "chat" | "project"; // Keeping for backward compatibility if needed, but mainly relying on projectId
  projectId?: string;
};

export interface ChatMessagesProps {
  messages: Message[];
  apiStatus: string | null;
  loading: boolean;
}

export interface ChatSidebarProps {
  chats: Chat[];
  projects: Project[];
  currentChatId: string | null;
  selectedProjectId: string | null;
  selectChat: (id: string) => void;
  selectProject: (id: string | null) => void;
  createChat: () => void;
  createProject: (name: string) => void;
  deleteChat: (id: string) => void;
  deleteProject: (id: string) => void;
  editingTitleId: string | null;
  setEditingTitleId: (id: string | null) => void;
  editingTitleVal: string;
  setEditingTitleVal: (val: string) => void;
  updateChatTitle: () => void;
  onClose?: () => void;
}

export interface ChatInputProps {
  input: string;
  setInput: (val: string) => void;
  loading: boolean;
  onSend: () => void;
  stopStream: () => void;
  disabled?: boolean;
  setModel: (model: string) => void;
  systemMessage: string;
  setSystemMessage: (msg: string) => void;
  apiStatus: string | null;
  sidebarProps: {
    chats: Chat[];
    projects: Project[];
    currentChatId: string | null;
    selectedProjectId: string | null;
    selectChat: (id: string) => void;
    selectProject: (id: string | null) => void;
    createChat: () => void;
    createProject: (name: string) => void;
    deleteChat: (id: string) => void;
    deleteProject: (id: string) => void;
    editingTitleId: string | null;
    setEditingTitleId: (id: string | null) => void;
    editingTitleVal: string;
    setEditingTitleVal: (val: string) => void;
    updateChatTitle: () => void;
  };
}
