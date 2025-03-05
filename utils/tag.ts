import { kenTags, seasonTags } from "@/data/tag";
import { TagId } from "@/types/tag";

export const getTagLabel = (tagId: TagId) => {
    const tagKen = kenTags.find(tag => tag.id === tagId);
    const tagSeason = seasonTags.find(tag => tag.id === tagId);
    
    return tagKen?.label || tagSeason?.label || '';
};

export const addTagSearchParams = (tagId: TagId, defaultTag: TagId[]) => {
    if (defaultTag.includes(tagId)) {
        return defaultTag.filter(tag => tag !== tagId);
    } else {
        return [...defaultTag, tagId];
    }
};
