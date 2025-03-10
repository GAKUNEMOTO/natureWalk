
import { createClient } from "@/utils/supabase/client"
import { notFound } from "next/navigation";
import Image from 'next/image';
import { NatureItem } from "@/types/nature";
import { kenTags, seasonTags } from "@/data/tag";
import { getTagLabel } from "@/utils/tag";
import { CalendarDays, Leaf, MapPin } from "lucide-react";
import { NatureDetailClient } from "./components/naturedetail";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";


// params の型定義
type Props = {
  params: Promise<{
    id: string;
  }>;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString();
}

const supabase = createClient();
export const dynamic = 'force-dynamic'; 
export const dynamicParams = true;
export const revalidate = 0;

// generateStaticParams を async 関数として定義
export async function generateStaticParams() {
  try {
    const { data: natures, error } = await supabase
      .from("natures").select("id")
      .order('created_at', { ascending: false }) ;

    if (error || !natures) {
      return [];
    }

    return natures.map((nature) => ({
      id: String(nature.id),
    }));
  } catch (error) {
    console.error("Error in generateStaticParams:", error);
    return [];
  }
}

// メインコンポーネントを Props 型で型付け
export default async function NaturePost(props: Props) {
  const params = await props.params;
  const { id } = params;

  try {
    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      return notFound();
    }
    
       // Supabaseクエリの最適化
    const { data: nature, error } = await supabase
      .from("natures")
      .select(`
        *,
        profiles!fk_natures_user_id (
          full_name,
          avatar_url
        )
      `)
      .eq("id", numericId)
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return notFound();
    }

    if (!nature) {
      console.log("Nature not found for ID:", id);
      return notFound();
    }

    const natureItem: NatureItem = {
      createdAt: nature.createdAt,
      id: nature.id,
      title: nature.title,
      description: nature.description,
      natureImg: nature.natureImg,
      tags: nature.tags || [],
      user_id: nature.user_id,
      profile: nature.profiles,
      likes: nature.likes,
    };

    const placeTags = natureItem.tags.filter((tag: string) => 
      kenTags.some(kenTag => kenTag.id === tag)
    );
    const seasonTagsFiltered = natureItem.tags.filter((tag: string) => 
      seasonTags.some(seasonTag => seasonTag.id === tag)
    );
    

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
                <div className="bg-gradient-to-b from-green-50 to-white rounded-2xl shadow-lg overflow-hidden">
                <div className="relative w-full h-[400px] md:h-[500px]">
            {natureItem.profile && (
              <Link href={`/profile/${natureItem.user_id}`}>
                <div className="absolute top-6 left-6 z-10 flex items-center gap-3 bg-black/30 p-3 rounded-full">
                    <Avatar className="h-12 w-12 border-2 border-white">
                        <AvatarImage 
                            className="object-cover" 
                            src={natureItem.profile.avatar_url || ''} 
                        />
                        <AvatarFallback>
                            {natureItem.profile.full_name?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-white font-medium drop-shadow-md">
                        {natureItem.profile.full_name}
                    </span>
                </div>
              </Link>
            )}
            

            <Image
                src={natureItem.natureImg || "/placeholder.svg"}
                alt={natureItem.title || "自然の風景"}
                fill
                priority
                className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h1 className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-md">
                    {natureItem.title}
                </h1>
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

export const config = {
  matcher: '/nature/:path*',
};