"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Copy, Check, Sparkles } from "lucide-react";
import Contribution from "@/components/Contribution";
import Footer from "@/components/Footer";
import { copyToClipboard } from "@/lib/utils";

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

  const copyPrompt = async (text: string, index: number) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    }
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
            📚 Prompt Library
          </Badge>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent pb-1">
            Discover & Share Prompts
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A curated collection of prompts to help you get the most out of your
            AI tools.
          </p>
        </div>
      </section>

      <section className="px-4 pb-12">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-card/50 backdrop-blur-sm p-4 rounded-2xl border border-border/50 shadow-sm">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search prompts..."
                className="pl-9 bg-background/50 border-border/50 focus:bg-background transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2 justify-center md:justify-end w-full md:w-2/3">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer
                  ${
                    !selectedCategory
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105"
                      : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground border border-transparent hover:border-border"
                  }
                `}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer
                    ${
                      selectedCategory === cat
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105"
                        : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground border border-transparent hover:border-border"
                    }
                  `}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Prompts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredPrompts.map((prompt, index) => (
              <Card
                key={index}
                className={`
                  group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm 
                  hover:bg-card hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 
                  transition-all duration-300 flex flex-col h-full
               `}
              >
                <CardHeader className="p-4 pb-0">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`
                          p-1.5 rounded-md bg-gradient-to-br from-primary/10 to-primary/5 
                          text-primary group-hover:scale-110 group-hover:rotate-3 transition-all duration-300
                        `}
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                      </div>
                      <Badge
                        variant="secondary"
                        className="text-[10px] font-medium opacity-70 px-1.5 py-0.5 h-5"
                      >
                        {prompt.category}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer h-6 w-6 -mr-2 -mt-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => copyPrompt(prompt.prompt, index)}
                    >
                      {copiedIndex === index ? (
                        <Check className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  <CardTitle className="mt-2 text-base font-bold leading-tight group-hover:text-primary transition-colors line-clamp-1">
                    {prompt.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 text-[11px] mt-1">
                    {prompt.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1 p-4 pt-0">
                  <div className="bg-muted/30 rounded-md p-2.5 text-xs font-mono text-muted-foreground min-h-[60px] leading-relaxed border border-border/50">
                    <p className="line-clamp-3">{prompt.prompt}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPrompts.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <div className="inline-flex p-4 rounded-full bg-muted mb-4">
                <Search className="h-6 w-6 opacity-50" />
              </div>
              <p>No prompts found matching your criteria.</p>
            </div>
          )}

          <div className="py-4">
            <Contribution />
          </div>
        </div>
        <Footer />
      </section>
    </div>
  );
}
