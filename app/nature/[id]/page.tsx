// 'use client';

import { createClient } from "@/lib/supabase/client"
import { NatureItem } from "@/types/nature";
import { notFound } from "next/navigation";

// import { useParams } from 'next/navigation';
// import ClientPage from './clientpage';


// const Page = () => {
//   const params = useParams();
//   const id = params.id as string;

//   return <ClientPage params={{ id }} />;
// };

// export default Page;
export type TagId = {
  id: number;
  name: string;
};

const supabase = createClient();
export const revalidate = 0;

export async function generateStaticParams() {
  const { data: natures } = await supabase.from("natures").select("id");

  if(!natures) {
    return [];
  }


  return natures?.map(({ id }) => ({
    id: id.toString(),  // idを文字列に変換
  }));
}

export default async function NaturePost({
  params: { id }
}: {
  params: { id: string }
}) {
  const { data: nature } = await supabase
    .from("natures")
    .select("*")
    .eq("id", parseInt(id, 10))  // idを数値に変換してクエリを実行
    .single();

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
      <img src={natureItem.natureImg} alt={natureItem.title} />
      <p>{natureItem.description}</p>
    </div>
  );
}