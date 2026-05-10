"use client";

import { useEffect, useState } from "react";
import { Server, Bot, RefreshCw } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { apiClient } from "@/lib/api-client";
import { clsx } from "clsx";

type Status = "loading" | "online" | "offline";

export default function ApiStatus() {
  const [localStatus, setLocalStatus] = useState<Status>("loading");
  const [cloudStatus, setCloudStatus] = useState<Status>("loading");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedService, setSelectedService] = useState<string>("local");

  const checkApiStatus = async () => {
    setIsRefreshing(true);
    try {
      const response = await apiClient.getStatus();

      // Determine individual statuses
      const providers = response.providers || [];
      const hasLocal = providers.includes("ollama-local");
      const hasCloud = providers.includes("ollama-cloud");

      setLocalStatus(hasLocal ? "online" : "offline");
      setCloudStatus(hasCloud ? "online" : "offline");
    } catch {
      setLocalStatus("offline");
      setCloudStatus("offline");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    checkApiStatus();
    // Load initial preference
    const stored = localStorage.getItem("selected_ollama_service");
    if (stored) setSelectedService(stored);

    // Refresh every 30 seconds
    const interval = setInterval(checkApiStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleServiceChange = (service: string) => {
    setSelectedService(service);
    localStorage.setItem("selected_ollama_service", service);
    // Trigger storage event for same-window listeners
    window.dispatchEvent(new Event("storage_sync"));
  };

  const getStatusColor = (s: Status) => {
    if (s === "online") return "text-green-500";
    if (s === "offline") return "text-red-500";
    return "text-gray-400";
  };

  const overallOnline = localStatus === "online" || cloudStatus === "online";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="API Status"
          className="focus:outline-none cursor-pointer flex items-center gap-1.5 px-2 py-1 rounded-full hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
          onClick={() => checkApiStatus()}
        >
          <div className="flex -space-x-1">
            <Server className={clsx("h-3.5 w-3.5", getStatusColor(localStatus), localStatus === "loading" && "animate-pulse")} />
            <Bot className={clsx("h-3.5 w-3.5", getStatusColor(cloudStatus), cloudStatus === "loading" && "animate-pulse")} />
          </div>
          <div className={clsx(
            "w-2 h-2 rounded-full",
            overallOnline ? "bg-green-500 animate-pulse" : "bg-red-500"
          )} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="center"
        className="w-56 p-4 rounded-xl shadow-xl border bg-background/95 backdrop-blur-sm z-[100]"
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Service Status</span>
            <button
              onClick={(e) => { e.stopPropagation(); checkApiStatus(); }}
              className={clsx("text-muted-foreground hover:text-foreground transition-colors", isRefreshing && "animate-spin")}
            >
              <RefreshCw className="h-3 w-3" />
            </button>
          </div>

          <div className="space-y-2">
            <div
              className={clsx(
                "flex items-center justify-between text-sm p-1.5 rounded-lg transition-all cursor-pointer",
                selectedService === "local" ? "bg-primary/5 ring-1 ring-primary/20" : "hover:bg-muted/50"
              )}
              onClick={() => handleServiceChange("local")}
            >
              <div className="flex items-center gap-2">
                <Server className={clsx("h-4 w-4", getStatusColor(localStatus))} />
                <span>Ollama (Local)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={clsx("text-[10px] font-bold uppercase px-1.5 py-0.5 rounded",
                  localStatus === "online" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                )}>
                  {localStatus}
                </span>
                {selectedService === "local" && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
              </div>
            </div>

            <div
              className={clsx(
                "flex items-center justify-between text-sm p-1.5 rounded-lg transition-all cursor-pointer",
                selectedService === "cloud" ? "bg-primary/5 ring-1 ring-primary/20" : "hover:bg-muted/50"
              )}
              onClick={() => handleServiceChange("cloud")}
            >
              <div className="flex items-center gap-2">
                <Bot className={clsx("h-4 w-4", getStatusColor(cloudStatus))} />
                <span>Ollama Cloud</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={clsx("text-[10px] font-bold uppercase px-1.5 py-0.5 rounded",
                  cloudStatus === "online" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                )}>
                  {cloudStatus}
                </span>
                {selectedService === "cloud" && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
              </div>
            </div>
          </div>

          <div className="pt-2 border-t text-[10px] text-muted-foreground text-center">
            {localStatus === "online" && cloudStatus === "online"
              ? "All systems functional"
              : overallOnline
                ? "Partial availability"
                : "No services reachable"}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
