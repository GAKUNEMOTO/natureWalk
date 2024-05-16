'use server';
import { createClient } from "@/lib/supabase/server";


export const getNatures = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.from('natures').select();

  if (error) {
    console.error(error);
    return [];
  }

  return data;
};




export const searchNature = async (keyword: string) => {
    const supabase = createClient();

    let query = supabase
        .from('nature')
        .select();

        if(keyword.includes( ' and ')) {
            const keywords = keyword.split(' and ').map((word) => `%${word}%`);
            keywords.forEach((word) => {
                query = query.ilike('title', word);
            });
        } else if (keyword.includes( ' or ')) {
            const keywords = keyword.split(' or ').map((word) => `%${word}%`);
            query = query.or(keywords.map((word) => `name.ilike.${word}`).join(','));
        }  else {
            query = query.ilike('name', `%${keyword}%`);
          }


    const { data, error } = await query;

    console.log(data, error, keyword);

    return data;
}

export const getNature = async (id: string) => {
    const supabase = createClient();

    const {data, error} = await supabase.from('nature').select().eq('id', id).single();

    console.log(data);

    return data;
}