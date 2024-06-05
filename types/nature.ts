import { TagId } from "./tag";

export type NatureFormData = {
    title: string;
    description: string;
    natureImg: File | string; 
    tag: TagId[];
  };
  

  export type NatureItem = {
    id: number;
    title: string;
    description: string;
    natureImg: string;
    tags: TagId[];
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
