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
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";

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
        //setAvailableProviders(response.providers || []);
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
    <>
      <section className="px-3 mb-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-4">
            <h3 className="text-3xl font-bold">Choose Your AI Tool</h3>
            <p className="text-lg">
              Select from our collection of powerful AI-powered writing
              assistants
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={
                  selectedCategory === category
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    : ""
                }
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTools.map((tool) => (
              <Card
                key={tool.id}
                className={`group hover:shadow-md transition-all duration-300 cursor-pointer border hover:bg-white/10 ${
                  apiStatus === "offline" ? "opacity-50" : ""
                }`}
                onClick={() => handleToolSelect(tool.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg group-hover:scale-110 transition-transform duration-300">
                      {tool.icon}
                    </div>
                    <div className="flex flex-col gap-1">
                      {tool.popular && (
                        <Badge
                          variant="default"
                          className="bg-orange-500 hover:bg-orange-600 text-xs"
                        >
                          Popular
                        </Badge>
                      )}
                      {tool.new && (
                        <Badge
                          variant="default"
                          className="bg-green-500 hover:bg-green-600 text-xs"
                        >
                          New
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                    {tool.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-2 leading-relaxed">
                    {tool.description}
                  </CardDescription>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {tool.category}
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
