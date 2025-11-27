"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Save, Trash2, Plus } from "lucide-react";
import clsx from "clsx";
import { ChatSidebarProps } from "@/types/chat";

export function ChatSidebar({
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
  onClose,
}: ChatSidebarProps) {
  const handleChatSelect = (id: string) => {
    selectChat(id);
    if (onClose) onClose();
  };

  return (
    <aside className="flex flex-col sticky top-0 p-4 border-r bg-background h-full py-4 overflow-y-auto">
      {/* New Chat Button */}
      <div className="flex mb-4 justify-end">
        <Button onClick={createChat} className="w-auto">
          <Plus className="h-6 w-6 mr-1" />
          New Chat
        </Button>
      </div>

      {/* Chat List */}
      <div className="flex flex-col gap-2 flex-grow">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={clsx(
              "flex items-center justify-between p-2 transition-colors duration-200 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md",
              currentChatId === chat.id && "border font-semibold rounded-md"
            )}
            onClick={() => handleChatSelect(chat.id)}
          >
            {editingTitleId === chat.id ? (
              <div className="flex flex-1 items-center gap-2">
                <Input
                  value={editingTitleVal}
                  onChange={(e) => setEditingTitleVal(e.target.value)}
                  className="text-sm h-8"
                  autoFocus
                />
                <Button size="icon" onClick={updateChatTitle}>
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <span className="truncate flex-1 text-sm">{chat.title}</span>
                <div className="flex items-center gap-1 ml-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingTitleId(chat.id);
                      setEditingTitleVal(chat.title);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Trash2
                    className="cursor-pointer text-red-500 hover:text-red-700 h-4 w-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChat(chat.id);
                    }}
                  />
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
