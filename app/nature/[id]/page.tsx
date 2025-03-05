import { createClient } from "@/utils/supabase/client"
import { notFound } from "next/navigation";
import Image from 'next/image';
import { NatureItem } from "@/types/nature";
import { kenTags, seasonTags } from "@/data/tag";
import { getTagLabel } from "@/utils/tag";

import { CalendarDays, Leaf, MapPin } from "lucide-react";
import { NatureDetailClient } from "./components/naturedetail";

export type TagId = {
  id: number;
  name: string;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString();
}


export const revalidate = 0;
const supabase = createClient();

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
<div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="bg-gradient-to-b from-green-50 to-white rounded-2xl shadow-lg overflow-hidden">
          <div className="relative w-full h-[400px] md:h-[500px]">
            <Image
              src={natureItem.natureImg || "/placeholder.svg"}
              alt={natureItem.title || "自然の風景"}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-md">{natureItem.title}</h1>
              <div className="flex items-center gap-2 text-sm md:text-base">
                <CalendarDays className="h-4 w-4" />
                <span>{formatDate(natureItem.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <section className="mb-8">
                  <h2 className="text-xl font-bold text-green-800 border-b-2 border-green-300 pb-2 mb-4 flex items-center gap-2">
                    <Leaf className="h-5 w-5" />
                    魅力
                  </h2>
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-green-100">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{natureItem.description}</p>
                  </div>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-bold text-green-800 border-b-2 border-green-300 pb-2 mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    場所
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {placeTags.length > 0 ? (
                      placeTags.map((tag, index) => (
                        <div
                          key={index}
                          className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium"
                        >
                          {getTagLabel(tag)}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">場所の情報がありません</p>
                    )}
                  </div>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-bold text-green-800 border-b-2 border-green-300 pb-2 mb-4 flex items-center gap-2">
                    <CalendarDays className="h-5 w-5" />
                    シーズン
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {seasonTagsFiltered.length > 0 ? (
                      seasonTagsFiltered.map((tag, index) => (
                        <div
                          key={index}
                          className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium"
                        >
                          {getTagLabel(tag)}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">シーズン情報がありません</p>
                    )}
                  </div>
                </section>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <NatureDetailClient item={natureItem} />
            </div>
          </div>
        </div>
      </div>
  );
  } catch (error) {
    console.error("Error in NaturePost:", error as Error);
    notFound();
  }
}
