import { kenTags } from "@/data/tag";

export type Tag = {
    id: string;
    label: string;
}

export type TagId = typeof kenTags[number]['id'];
