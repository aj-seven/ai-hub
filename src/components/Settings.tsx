"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import APIKeys from "./ApiKey";
import { Bot, Key, Sun } from "lucide-react";
import OllamaSettings from "./OllamaSettings";
import AppearanceSettings from "./AppearanceSettings"; // ← NEW

export default function Settings() {
  const [selectedTab, setSelectedTab] = useState("api-keys");

  return (
    <div>
      <Tabs
        defaultValue={selectedTab}
        value={selectedTab}
        onValueChange={(value) => setSelectedTab(value)}
        className="w-full"
      >
        {/* Tab Navigation */}
        <TabsList className="flex flex-wrap gap-2 justify-start sm:justify-start">
          <TabsTrigger value="api-keys" className="cursor-pointer">
            <Key className="h-4 w-4" />
            API Keys
          </TabsTrigger>

          <TabsTrigger value="set-ollama" className="cursor-pointer">
            <Bot className="h-4 w-4" />
            Ollama
          </TabsTrigger>

          {/* NEW APPEARANCE TAB */}
          <TabsTrigger value="appearance" className="cursor-pointer">
            <Sun className="h-4 w-4" />
            Appearance
          </TabsTrigger>
        </TabsList>

        {/* Tab Content */}
        <TabsContent value="api-keys">
          <APIKeys />
        </TabsContent>

        <TabsContent value="set-ollama">
          <OllamaSettings />
        </TabsContent>

        {/* NEW APPEARANCE TAB CONTENT */}
        <TabsContent value="appearance">
          <AppearanceSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
