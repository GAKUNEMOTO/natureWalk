"use client";

import * as React from "react";
import {
  Shrub,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "./ui/button";
import { NatureItem } from "@/types/nature";
import Link from "next/link";

export function Command({ items }: { items: NatureItem[] }): JSX.Element {
  const [open, setOpen] = React.useState(false);

  const filterItems = React.useMemo(() => {
    return items.reduce((acc: NatureItem[], current) => {
      const exists = acc.find(item => item.title === current.title);
      if (!exists) {
        return [...acc, current];
      }
      return acc;
    }, []);
  }, [items]);


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
        className="gap-3 text-muted-foreground w-36"
        size="sm"
        onClick={() => setOpen(true)}
      >
        自然を検索...
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>見つかりません...</CommandEmpty>
          <CommandGroup heading="Natures">
            {filterItems.map((item) => (
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
        </CommandList>
      </CommandDialog>
    </>
  );
}
