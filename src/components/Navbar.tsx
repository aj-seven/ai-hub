"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ScrollText,
  Info,
  Settings2Icon,
  BotMessageSquare,
  PenTool,
  Github,
  PaperclipIcon,
  LockIcon,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Settings from "./Settings";
import Image from "next/image";
import { CustomDialog } from "./ui/custom-dialog";
import ApiStatus from "./ApiStatus";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { name: "Chat", href: "/chat", icon: BotMessageSquare },
    { name: "Tools", href: "/get-started", icon: PenTool },
    { name: "Prompts", href: "/prompts", icon: ScrollText },
    { name: "About", href: "/about", icon: Info },
    { name: "Terms", href: "/terms", icon: PaperclipIcon },
    { name: "Privacy", href: "/privacy", icon: LockIcon },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="max-w-8xl mx-auto px-3 lg:px-22">
        <div className="flex items-center justify-between h-14">
          {/* Logo (Always Left — Web + Tauri Same) */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/assets/logo-nobg.png"
              alt="AI Hub Logo"
              width={36}
              height={36}
              priority
            />
            <span className="text-lg font-semibold">AI Hub</span>
          </Link>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* GitHub */}
            <Link
              href="https://github.com/aj-seven/ai-hub"
              target="_blank"
              className="flex items-center hover:bg-gray-200 dark:hover:bg-gray-800 
              rounded-md p-2 transition-all"
            >
              <Github className="h-5 w-5" />
            </Link>

            {/* API Status */}
            <ApiStatus />

            {/* Sidebar Menu */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="cursor-pointer"
                >
                  {open ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-[280px] px-2 py-4 cursor-pointer"
              >
                <SheetTitle className="text-xl">AI Hub</SheetTitle>

                <div className="border-t" />

                {/* Navigation */}
                <div className="flex flex-col">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-2 px-2 py-2 text-md font-medium rounded-md transition
      hover:bg-muted ${pathname === link.href ? "bg-muted text-blue-500" : ""}`}
                    >
                      <link.icon className="h-5 w-5" />
                      {link.name}
                    </Link>
                  ))}
                </div>

                {/* Divider */}
                <div className="border-t" />

                {/* Settings */}
                <CustomDialog
                  title="Settings"
                  description="Manage settings for AI Hub"
                  triggerLabel="Settings"
                  icon={<Settings2Icon />}
                >
                  <Settings />
                </CustomDialog>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
