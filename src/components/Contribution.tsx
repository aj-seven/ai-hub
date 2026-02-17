"use client";

import { MessageCircleQuestion, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Contribution() {
  return (
    <div className="mt-12 border-t pt-6 text-sm flex flex-col md:flex-row items-center justify-between gap-4 bg-muted/10 p-4 rounded-xl">
      <div className="flex items-center gap-2 text-muted-foreground">
        <MessageCircleQuestion className="w-4 h-4" />
        <span>
          Found a mistake or Improve this content? Help us improve this page.
        </span>
      </div>
      <div className="flex gap-3">
        <Link
          href="https://github.com/aj-seven/ai-hub/issues/new"
          target="_blank"
        >
          <Button variant="outline" size="sm" className="cursor-pointer">
            <Github className="w-4 h-4" />
            Create Issue
          </Button>
        </Link>
        <Link href="https://github.com/aj-seven/ai-hub/pulls" target="_blank">
          <Button variant="secondary" size="sm" className="cursor-pointer">
            Contribute
          </Button>
        </Link>
      </div>
    </div>
  );
}
