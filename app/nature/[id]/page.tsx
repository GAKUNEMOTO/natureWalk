
import { notFound } from "next/navigation";
import Image from 'next/image';
import { NatureItem } from "@/types/nature";
import { kenTags, seasonTags } from "@/data/tag";
import { getTagLabel } from "@/lib/tag";
import NatureDetailClient from "./components/naturedetail";
import { createClient } from "@/lib/supabase/client";

export type TagId = {
  id: number;
  name: string;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString();
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

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
      tags: nature.tags,
      isRecommend: false
    };

    const placeTags = natureItem.tags.filter((tag: string) => kenTags.some(kenTag => kenTag.id === tag));
    const seasonTagsFiltered = natureItem.tags.filter((tag: string) => seasonTags.some(seasonTag => seasonTag.id === tag));

    return (
<div className='p-8 bg-green-50 rounded-3xl shadow-lg'>
  <div className='overflow-hidden border-4 border-green-600 rounded-2xl bg-white bg-opacity-90'>
    <div className='container py-8 px-6'>
      <div className='flex justify-between mb-6 items-center'>
        <h1 className='text-4xl font-bold text-green-800'>{natureItem.title}</h1>
        <div className='flex flex-col items-end'>
          <p className="text-amber-700">作成日</p>
          <div className='text-amber-600 mt-2 font-semibold'>{formatDate(natureItem.createdAt)}</div>
        </div>
      </div>
      <div className='w-full h-[400px] relative mb-8 border-4 border-amber-300 rounded-xl overflow-hidden'>
        <Image
          src={natureItem.natureImg}
          alt="nature image"
          layout="fill"
          objectFit="cover"
          className="rounded-lg transition-transform duration-300 hover:scale-105"
        />
      </div>
      <h3 className="font-bold text-2xl text-blue-700 border-b-4 border-blue-400 mb-4">魅力</h3>
      <p className='p-4 bg-sky-100 rounded-lg text-gray-700 leading-relaxed'>
        {natureItem.description}
      </p>
      
      <h3 className='font-bold text-2xl text-blue-700 border-b-4 border-blue-400 mt-8 mb-4'>場所</h3>
      <div className='flex flex-wrap gap-3 mb-6'>
        {placeTags.map((tag, index) => (
          <div key={index} className='bg-green-100 rounded-full text-green-800 px-4 py-2 text-lg font-semibold'>
            {getTagLabel(tag)}
          </div>
        ))}
      </div>
      
      <h3 className='font-bold text-2xl text-blue-700 border-b-4 border-blue-400 mt-8 mb-4'>シーズン</h3>
      <div className='flex flex-wrap gap-3 mb-6'>
        {seasonTagsFiltered.map((tag, index) => (
          <div key={index} className='bg-yellow-100 rounded-full text-yellow-800 px-4 py-2 text-lg font-semibold'>
            {getTagLabel(tag)}
          </div>
        ))}
      </div>
      
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
