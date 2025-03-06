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
    user_id: string;
    likes?: number | {  // オプショナルにして、number型も許容
      count: number;
      isLiked?: boolean;
    };
    profile?: {  
      avatar_url?: string;
      full_name?: string;
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
