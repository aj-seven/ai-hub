"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Settings2,
  Menu,
  X,
  ScrollText,
  Info,
  Settings2Icon,
  BotMessageSquare,
  PenTool,
} from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
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
import { isTauri } from "@tauri-apps/api/core";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { name: "Chat", href: "/chat", icon: BotMessageSquare },
    { name: "Tools", href: "/get-started", icon: PenTool },
    { name: "Prompts", href: "/prompts", icon: ScrollText },
    { name: "About", href: "/about", icon: Info },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="max-w-7xl mx-auto px-3">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          {isTauri() ? (
            <></>
          ) : (
            <>
              <Link href="/" className="flex items-center gap-1">
                <div className="rounded-lg">
                  <Image
                    src="/assets/logo-nobg.png"
                    alt="AI Hub Logo"
                    width={42}
                    height={42}
                  />
                </div>
                <span className="text-xl font-bold ">AI Hub</span>
              </Link>
            </>
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-1 font-medium hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md p-1 transition-all ${
                  pathname === link.href ? "text-blue-600" : ""
                }`}
              >
                <link.icon className="h-4 w-4" />
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-4">
            {/* API status */}
            <ApiStatus />

            {/* Settings Drawer */}
            <Drawer>
              <DrawerTrigger asChild>
                <Button
                  variant="outline"
                  size="default"
                  className="cursor-pointer"
                >
                  <Settings2 />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="p-3 max-w-3xl mx-auto">
                <Settings />
              </DrawerContent>
            </Drawer>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center ">
            <div className="mr-2 flex items-center justify-center">
              <ApiStatus />
            </div>
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="default"
                  className="cursor-pointer"
                >
                  {mobileOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-[250px] p-3">
                <SheetTitle className="text-xl mb-2">Menu</SheetTitle>
                <div className="flex flex-col space-y-3">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-1 p-1 text-base font-medium transition hover:bg-foreground/20 rounded-md ${
                        pathname === link.href
                          ? "text-blue-600"
                          : "text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      <link.icon className="h-5 w-5" />
                      {link.name}
                    </Link>
                  ))}

                  <div className="pt-3 border-t border-muted">
                    <CustomDialog
                      title="Settings"
                      description="Manage settings for AI Hub"
                      triggerLabel="Settings"
                      icon={<Settings2Icon />}
                    >
                      <Settings />
                    </CustomDialog>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
