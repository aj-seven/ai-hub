"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { tools } from "@/app/_components/AITools";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import Footer from "@/components/Footer";

const categories = [
  "All",
  "Communication",
  "Writing",
  "Content",
  "Social Media",
];

export default function getStartedPage() {
  const router = useRouter();
  const [apiStatus, setApiStatus] = useState<"loading" | "online" | "offline">(
    "loading"
  );
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredTools =
    selectedCategory === "All"
      ? tools
      : tools.filter((tool) => tool.category === selectedCategory);

  const checkApiStatus = async () => {
    try {
      const response = await apiClient.getStatus();
      if (response.success) {
        setApiStatus("online");
      } else {
        setApiStatus("offline");
      }
    } catch (error) {
      setApiStatus("offline");
    }
  };

  const handleToolSelect = (toolId: string) => {
    if (apiStatus === "offline") {
      toast("Service Unavailable", {
        description:
          "AI services are currently offline. Please check your API configuration.",
        action: {
          label: "Retry",
          onClick: () => checkApiStatus(),
        },
      });
      return;
    }

    router.push(`/tools?id=${toolId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative px-4 py-10 md:py-14 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
        <div className="relative max-w-7xl mx-auto text-center space-y-3">
          <Badge
            variant="outline"
            className="mb-2 py-1 px-3 backdrop-blur border-primary/20 bg-primary/5 text-primary"
          >
            🎉 Explore AI Tools
          </Badge>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent pb-1">
            Supercharge Your Workflow
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Access a suite of powerful AI assistants designed to elevate your
            creativity and productivity.
          </p>
        </div>
      </section>

      <section className="pb-12">
        <div className="max-w-7xl mx-auto space-y-6 px-4 py-4 md:py-6">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer
                  ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105"
                      : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground border border-transparent hover:border-border"
                  }
                `}
              >
                {category}
              </button>
            ))}
          </div>
          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.map((tool) => (
              <Card
                key={tool.id}
                className={`
                  group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm 
                  hover:bg-card hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 
                  transition-all duration-300 cursor-pointer h-full flex flex-col
                  ${apiStatus === "offline" ? "opacity-60 grayscale" : ""}
                `}
                onClick={() => handleToolSelect(tool.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div
                      className={`
                      p-3 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 
                      text-primary group-hover:scale-110 group-hover:rotate-3 transition-all duration-300
                    `}
                    >
                      {tool.icon}
                    </div>
                    {(tool.popular || tool.new) && (
                      <div className="flex gap-2">
                        {tool.popular && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 text-orange-600 dark:text-orange-400">
                            Popular
                          </span>
                        )}
                        {tool.new && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-500/10 text-green-600 dark:text-green-400">
                            New
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                    {tool.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between gap-4">
                  <CardDescription className="text-sm leading-relaxed line-clamp-2">
                    {tool.description}
                  </CardDescription>

                  <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-auto">
                    <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                      {tool.category}
                    </span>
                    <div className="flex items-center text-xs font-medium text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      Try Now <ArrowRight className="ml-1 h-3 w-3" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {filteredTools.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <p>No tools found in this category.</p>
            </div>
          )}
          <Footer />
        </div>
      </section>
    </div>
  );
}
