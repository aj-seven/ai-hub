import { Chat, Project } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare, Calendar } from "lucide-react";
import clsx from "clsx";

interface ProjectViewProps {
  project: Project;
  chats: Chat[];
  onCreateChat: () => void;
  onSelectChat: (id: string) => void;
}

export function ProjectView({
  project,
  chats,
  onCreateChat,
  onSelectChat,
}: ProjectViewProps) {
  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto p-4 md:p-12 overflow-y-auto">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl w-16 h-16 mb-2">
            <div className="text-2xl">📂</div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            {project.title}
          </h1>
          <p className="text-muted-foreground text-lg">
            Project created on{" "}
            {new Date(project.createdAt).toLocaleDateString()}
          </p>

          <div className="pt-4">
            <Button
              size="lg"
              onClick={onCreateChat}
              className="gap-2 text-base px-8 h-12 shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="h-5 w-5" />
              Create New Chat
            </Button>
          </div>
        </div>

        {/* Recent Chats Grid */}
        <div className="space-y-4 mt-8">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
            Recent Chats
          </h2>

          {chats.length === 0 ? (
            <div className="border border-dashed border-border/60 rounded-xl p-12 text-center text-muted-foreground/60 bg-muted/5">
              <p>No chats in this project yet.</p>
              <p className="text-sm">Start a new chat to get things rolling!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => onSelectChat(chat.id)}
                  className={clsx(
                    "group p-4 rounded-xl border border-border/40 bg-card hover:bg-muted/40 hover:border-border/80 transition-all cursor-pointer shadow-sm hover:shadow-md flex flex-col gap-3 h-32"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="p-2 bg-primary/5 rounded-lg text-primary group-hover:bg-primary/10 transition-colors">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                      Chat
                    </span>
                  </div>
                  <h3 className="font-medium text-foreground line-clamp-2 leading-snug">
                    {chat.title}
                  </h3>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
