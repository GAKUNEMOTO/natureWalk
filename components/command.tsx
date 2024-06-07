"use client";

import * as React from "react";
import {
  CreditCard,
  Settings,
  Shrub,
  User,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Button } from "./ui/button";
import { NatureItem } from "@/types/nature";
import Link from "next/link";

export function Command({ items }: { items: NatureItem[] }): JSX.Element {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className="gap-3 text-muted-foreground"
        size="sm"
        onClick={() => setOpen(true)}
      >
        自然を検索...
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>J
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>見つかりません...</CommandEmpty>
          <CommandGroup heading="Natures">
            {items.map((item) => (
              <CommandItem
                key={item.id}
                className="relative flex items-center px-5 py-2"
              >
                <Shrub className="mr-5 h-4 w-4" />
                <Link href={`/nature/${item.id}`} className="absolute inset-0 flex items-center">
                  <span className="ml-9">{item.title}</span>
                </Link>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem className="px-5 py-2 hover:bg-gray-100">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem className="px-5 py-2 hover:bg-gray-100">
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem className="px-5 py-2 hover:bg-gray-100">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
