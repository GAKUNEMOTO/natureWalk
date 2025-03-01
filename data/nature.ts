'use server';
import { createClient } from "@/utils/supabase/server";

export const getNatures = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.from('natures').select();

  if (error) {
    console.error(error);
    return [];
  }

  return data;
};

export const getNature = async (id: string) => {
    const supabase = createClient();

    const {data, error} = await supabase.from('natures').select().eq('id', id).single();

    console.log(data);

    return data;
}
