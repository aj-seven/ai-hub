"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type CustomDialogProps = {
  title: string;
  description?: string;
  triggerLabel?: string;
  icon?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  customTrigger?: ReactNode;
};

export function CustomDialog({
  title,
  description,
  triggerLabel,
  icon,
  children,
  footer,
  className,
  customTrigger,
}: CustomDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {customTrigger ? (
          customTrigger
        ) : (
          <Button
            variant="outline"
            className="w-full justify-start cursor-pointer transition-all"
          >
            {icon && <span className="mr-2">{icon}</span>}
            {triggerLabel}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        className={cn(
          "p-4 flex flex-col max-h-[calc(100vh-4rem)] sm:max-w-lg min-h-[300px]",
          className
        )}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-xs">
              {description}
            </DialogDescription>
          ) || <div className="h-2" />}
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-2 pr-1">
          {children}
        </div>

        {footer && (
          <div className="mt-4 border-t pt-4">
            <DialogFooter>{footer}</DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
