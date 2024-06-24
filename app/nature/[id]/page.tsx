import { createClient } from "@/lib/supabase/client"
import { notFound } from "next/navigation";
import Image from 'next/image';
import { NatureItem } from "@/types/nature";

export type TagId = {
  id: number;
  name: string;
};

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

    return (
      <div>
        <h1>{natureItem.title}</h1>
        <Image src={natureItem.natureImg} alt={natureItem.title} width={600} height={400} />
        <p>{natureItem.description}</p>
      </div>
    );
  } catch (error) {
    console.error("Error in NaturePost:", error as Error);
    notFound();
  }
}
