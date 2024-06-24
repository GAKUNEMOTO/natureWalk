import { createClient } from "@/lib/supabase/client"
import { notFound } from "next/navigation";
import Image from 'next/image';
import { NatureItem } from "@/types/nature";
import { kenTags, seasonTags } from "@/data/tag";
import { getTagLabel } from "@/lib/tag";
import NatureDetailClient from "./components/naturedetail";

export type TagId = {
  id: number;
  name: string;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString();
}

const supabase = createClient();
export const revalidate = 0;

export async function generateStaticParams() {
  try {
    const { data: natures, error } = await supabase.from("natures").select("id");

    if (error) {
      console.error("Error fetching natures:", error.message);
      return [];
    }

    if (!natures) {
      return [];
    }

    return natures.map(({ id }) => ({
      id: id.toString(),  // idを文字列に変換
    }));
  } catch (error) {
    console.error("Error in generateStaticParams:", error as Error);
    return [];
  }
}

export default async function NaturePost({
  params: { id }
}: {
  params: { id: string }
}) {
  try {
    const { data: nature, error } = await supabase
      .from("natures")
      .select("*")
      .eq("id", parseInt(id, 10))  // idを数値に変換してクエリを実行
      .single();

    if (error) {
      console.error("Error fetching nature:", error.message);
      notFound();
    }

    if (!nature) {
      notFound();
    }

    const natureItem: NatureItem = {
      createdAt: nature.createdAt,
      id: nature.id,
      title: nature.title,
      description: nature.description,
      natureImg: nature.natureImg,
      tags: nature.tags
    };

    const placeTags = natureItem.tags.filter((tag: string) => kenTags.some(kenTag => kenTag.id === tag));
    const seasonTagsFiltered = natureItem.tags.filter((tag: string) => seasonTags.some(seasonTag => seasonTag.id === tag));

    return (
<div className='p-6'>
      <div className='overflow-hidden border mb-2 rounded'>
        <div className='container py-5'>
          <div className='flex justify-between mb-2'>
            <h1 className='text-3xl font-semibold'>{natureItem.title}</h1>
            <div className='flex flex-col'>
              <p className="text-muted-foreground">作成日</p>
              <div className='text-muted-foreground mt-2'>{formatDate(natureItem.createdAt)}</div>
            </div>
          </div>
          <div className='w-full h-96 relative mb-4'>
            <Image
              src={natureItem.natureImg}
              alt="nature image"
              layout="fill"
              objectFit="contain"
              className="rounded-sm"
            />
          </div>
          <h3 className="font-bold text-2xl text-muted-foreground border-b-4">魅力</h3>
          <p className='p-3'>
            {natureItem.description}
          </p>

          <h3 className='font-bold text-2xl text-muted-foreground border-b-4'>場所</h3>
          {placeTags.map((tag, index) => (
            <div key={index} className='bg-muted rounded text-xs px-1 py-1.5 mb-6'>
              <p className="text-xl">
                {getTagLabel(tag)}
              </p>
            </div>
          ))}

          <h3 className='font-bold text-2xl text-muted-foreground border-b-4'>シーズン</h3>
          {seasonTagsFiltered.map((tag, index) => (
            <div key={index} className='bg-muted rounded text-xs px-1 py-1.5 mb-6'>
              <p className="text-xl">
                {getTagLabel(tag)}
              </p>
            </div>
          ))}

          <NatureDetailClient item={natureItem} />
        </div>
      </div>
    </div>
  );
  } catch (error) {
    console.error("Error in NaturePost:", error as Error);
    notFound();
  }
}
