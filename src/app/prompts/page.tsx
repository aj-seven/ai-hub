"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Contribution from "@/components/Contribution";

interface Prompt {
  title: string;
  description: string;
  prompt: string;
  category: string;
}

export default function PromptLibraryPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrompts = async () => {
      const res = await fetch("/data/prompts.json");
      const data = await res.json();
      setPrompts(data);
    };
    fetchPrompts();
  }, []);

  const categories = Array.from(new Set(prompts.map((p) => p.category)));

  const filteredPrompts = prompts.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchCategory = selectedCategory
      ? p.category === selectedCategory
      : true;

    return matchSearch && matchCategory;
  });

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyPrompt = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 py-2">
      <h1 className="text-3xl font-bold mb-2">AI Prompt Library</h1>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-4">
        <Input
          type="text"
          placeholder="Search prompts..."
          className="w-full md:w-1/2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="flex flex-wrap gap-2 mt-3 md:mt-0">
          <Badge
            onClick={() => setSelectedCategory(null)}
            variant={!selectedCategory ? "default" : "outline"}
            className="cursor-pointer"
          >
            All
          </Badge>
          {categories.map((cat) => (
            <Badge
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              variant={selectedCategory === cat ? "default" : "outline"}
              className="cursor-pointer"
            >
              {cat}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredPrompts.map((prompt, index) => (
          <Card key={index} className="hover:shadow-md transition border p-2">
            <CardContent className="p-0 space-y-2">
              <h3 className="text-lg font-semibold">{prompt.title}</h3>
              <p className="text-muted-foreground">{prompt.description}</p>
              <pre className="bg-muted p-3 rounded text-sm whitespace-pre-wrap overflow-auto">
                {prompt.prompt}
                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={() => copyPrompt(prompt.prompt, index)}
                    className="mt-2 text-blue-600 hover:underline"
                  >
                    <Badge
                      variant={copiedIndex === index ? "default" : "outline"}
                      className="text-sm"
                    >
                      {copiedIndex === index ? "Copied!" : "Copy Prompt"}
                    </Badge>
                  </button>
                </div>
              </pre>
            </CardContent>
            <CardFooter>
              <h1 className="text-gray-500 text-sm font-semibold">
                {prompt.category}
              </h1>{" "}
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredPrompts.length === 0 && (
        <p className="text-center mt-10 text-muted-foreground">
          No prompts found.
        </p>
      )}

      <Contribution />
    </div>
  );
}
