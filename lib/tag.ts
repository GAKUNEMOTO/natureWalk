'use server';
import { kenTags } from "@/data/tag";
import { TagId } from "@/types/tag";

export const getTagLabel = (tagId: TagId) => {
    return kenTags.find(tag => tag.id === tagId);
    }

    export const addTagSearchParams = (tagId: TagId, defaultTag: TagId[]) => {
        if (defaultTag.includes(tagId)) {
            return defaultTag.filter(tag => tag !== tagId);
        } else {
            return [...defaultTag, tagId];
        }
    }

