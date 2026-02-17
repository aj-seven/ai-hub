"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pencil,
  Save,
  Trash2,
  Plus,
  MessageSquare,
  MoreHorizontal,
  FolderOpen,
  FolderPlus,
} from "lucide-react";
import clsx from "clsx";
import { ChatSidebarProps } from "@/types/chat";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ChatSidebar({
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
  onClose,
}: ChatSidebarProps) {
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  const handleChatSelect = (id: string) => {
    selectChat(id);
    if (onClose) onClose();
  };

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;
    createProject(newProjectName);
    setNewProjectName("");
    setIsProjectDialogOpen(false);
  };

  // Filter logic
  // If selectedProjectId is set, show ONLY chats for that project.
  // If selectedProjectId is NULL, show projects list AND global chats (no projectId).
  // Also handle backward compatibility: old chats with type="project" but no projectId should probably be hidden or migrated?
  // For now, let's assume we focus on the new structure.

  const displayedChats = selectedProjectId
    ? chats.filter((c) => c.projectId === selectedProjectId)
    : chats.filter((c) => !c.projectId && c.type !== "project"); // Exclude old projects if they exist in chat list

  const currentProject = projects.find((p) => p.id === selectedProjectId);

  return (
    <aside className="flex flex-col h-full bg-muted/10 border-r border-border/40 select-none">
      {/* Navigation Header */}
      {selectedProjectId ? (
        <div className="px-4 py-4 space-y-2">
          <Button
            onClick={() => selectProject(null)}
            className="w-full justify-start gap-2 h-8 text-muted-foreground hover:text-foreground mb-1 px-0"
            variant="link"
          >
            <span className="text-xs">← Back to Home</span>
          </Button>
          <div className="px-1">
            <div className="flex items-center gap-2 mb-3">
              <FolderOpen className="h-4 w-4 text-primary" />
              <span className="font-semibold text-sm truncate">
                {currentProject?.title || "Project"}
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Empty header space or remove entirely if desired, keeping consistent padding */
        <div className="h-4" />
      )}

      <div className="flex-1 overflow-y-auto px-3 scrollbar-none space-y-6">
        {/* Projects List (Only visible in Global View) */}
        {!selectedProjectId && (
          <div>
            <div className="flex items-center justify-between px-2 mb-2">
              <div className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider flex items-center gap-2">
                <FolderOpen className="h-3 w-3" />
                Projects
              </div>
              {/* New Project Dialog */}
              <Dialog
                open={isProjectDialogOpen}
                onOpenChange={setIsProjectDialogOpen}
              >
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Input
                        id="name"
                        placeholder="Project Name"
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleCreateProject();
                        }}
                        autoFocus
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={handleCreateProject}>
                      Create Project
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="flex flex-col gap-0.5">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className={clsx(
                    "group relative flex items-center justify-between p-2 rounded-lg text-sm transition-all duration-200 cursor-pointer",
                    "text-muted-foreground hover:bg-muted/40 hover:text-foreground border border-transparent"
                  )}
                  onClick={() => selectProject(project.id)}
                >
                  <div className="flex items-center gap-2 overflow-hidden flex-1">
                    <FolderOpen className="h-4 w-4 shrink-0 opacity-70" />
                    <span className="truncate">{project.title}</span>
                  </div>
                  <div
                    className={clsx(
                      "flex items-center opacity-0 transition-opacity absolute right-1.5 top-1/2 -translate-y-1/2 bg-gradient-to-l from-muted/50 to-transparent pl-2",
                      "group-hover:opacity-100"
                    )}
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-muted-foreground hover:text-foreground rounded-md"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteProject(project.id);
                          }}
                          className="text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}

              {/* "New Project" list item style button (Requested: "make entire clickable") */}
              <Button
                className="w-full justify-start gap-3 h-8 mb-2 bg-primary/10 text-primary hover:bg-primary/20 shadow-none hover:shadow-sm transition-all duration-200 rounded-lg border border-primary/20 cursor-pointer"
                variant="ghost"
                onClick={() => setIsProjectDialogOpen(true)}
              >
                <Plus className="h-4 w-4 opacity-50" />
                <span>Create New Project...</span>
              </Button>
            </div>
          </div>
        )}

        {/* Separator / History Header */}
        <div>
          <div className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider mb-2 px-2 flex items-center gap-2">
            <MessageSquare className="h-3 w-3" />
            {selectedProjectId ? "Chats" : "History"}
          </div>

          <Button
            onClick={createChat}
            className="w-full justify-start gap-3 h-8 mb-2 bg-primary/10 text-primary hover:bg-primary/20 shadow-none hover:shadow-sm transition-all duration-200 rounded-lg border border-primary/20 cursor-pointer"
            variant="ghost"
          >
            <Plus className="h-4 w-4" />
            <span className="font-semibold text-sm">New Chat</span>
          </Button>

          {/* Chat List */}
          <div className="flex flex-col gap-0.5">
            {displayedChats.length === 0 && (
              <div className="flex flex-col items-center justify-center text-center text-muted-foreground text-sm py-8 px-4 opacity-70">
                <MessageSquare className="h-8 w-8 mb-2 opacity-20" />
                <p className="text-xs">No chats yet</p>
              </div>
            )}

            {displayedChats.map((chat) => (
              <div
                key={chat.id}
                className={clsx(
                  "group relative flex items-center justify-between p-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer",
                  currentChatId === chat.id
                    ? "bg-muted/80 text-foreground font-medium shadow-sm border border-border/50"
                    : "text-muted-foreground hover:bg-muted/40 hover:text-foreground border border-transparent"
                )}
                onClick={() => handleChatSelect(chat.id)}
              >
                {editingTitleId === chat.id ? (
                  <div
                    className="flex flex-1 items-center gap-1.5 min-w-0 z-10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Input
                      value={editingTitleVal}
                      onChange={(e) => setEditingTitleVal(e.target.value)}
                      className="h-8 text-xs px-2.5 rounded-lg bg-background shadow-sm"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") updateChatTitle();
                      }}
                    />
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 shrink-0 hover:bg-green-500/10 hover:text-green-600 rounded-lg"
                        onClick={updateChatTitle}
                      >
                        <Save className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 overflow-hidden flex-1">
                      <MessageSquare
                        className={clsx(
                          "h-4 w-4 shrink-0 transition-colors",
                          currentChatId === chat.id
                            ? "text-primary"
                            : "text-muted-foreground/50 group-hover:text-muted-foreground"
                        )}
                      />
                      <span className="truncate leading-tight">
                        {chat.title}
                      </span>
                    </div>

                    {/* Actions Dropdown for cleaner UI */}
                    <div
                      className={clsx(
                        "flex items-center opacity-0 transition-opacity absolute right-1.5 top-1/2 -translate-y-1/2 bg-gradient-to-l from-muted/80 via-muted/80 to-transparent pl-2",
                        "group-hover:opacity-100",
                        currentChatId === chat.id &&
                          "opacity-100 from-muted via-muted" // Keep visible if active
                      )}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-background/80 rounded-lg"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-32 rounded-xl"
                        >
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingTitleId(chat.id);
                              setEditingTitleVal(chat.title);
                            }}
                            className="cursor-pointer text-xs"
                          >
                            <Pencil className="h-3.5 w-3.5 mr-2 opacity-70" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteChat(chat.id);
                            }}
                            className="cursor-pointer text-xs text-destructive focus:text-destructive focus:bg-destructive/10"
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-2 opacity-70" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
