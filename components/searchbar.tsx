'use client';
import React, { useState } from 'react'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
  } from "@/components/ui/command"

export default function SearchBar() {
  return (
<Command className="w-72">
  <CommandInput placeholder="検索" />
</Command>
  )
}
