import { ReactNode } from "react";
import { TagId } from "./tag";

export type NatureFormData = {
    title: string;
    description: string;
    natureImg: File | string; 
    tags: TagId[];
  };
  

  export type NatureItem = {
    createdAt: string;
    id: number;
    title: string;
    description: string;
    natureImg: string;
    tags: TagId[];
    likes?: {
      count: number;  
      isLiked?: boolean;  
  };
  };

  export type NatureCardProps = {
    items: NatureItem[];
  };

  export type NaturePageProps = {
    items: NatureItem[];
  };

export type NatureContextType = {
  items: NatureItem[];
  addNatureItem: (item: NatureItem) => void;
};
