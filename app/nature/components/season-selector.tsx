import React from 'react';
import { kenTags, seasonTags } from "@/data/tag";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

const SeasonSelecter = ({ onSelect }: { onSelect: (value: string) => void }) => {
  return (
    <Select onValueChange={onSelect}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="タグを選択" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>シーズンタグ</SelectLabel>
          {seasonTags.map((tag) => (
            <SelectItem key={tag.id} value={tag.id}>
              {tag.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SeasonSelecter;
