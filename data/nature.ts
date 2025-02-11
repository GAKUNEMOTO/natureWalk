'use server';
import { createClient } from "@/lib/supabase/server";

export const getNatures = async () => {
  const supabase = createClient();
  const controler = new AbortController();
  const timeout = setTimeout(() => controler.abort(), 5000);

  try {
    const { data, error } = await supabase
    .from('natures')
    .select()
    .abortSignal(controler.signal);

    clearTimeout(timeout);

    if (error) {
      console.error(error);
      return [];
    }
  
    return data;
  } catch (error) {
      console.error("Timeout or fetch error:", error);
    return [];
  }


};

export const getNature = async (id: string) => {
    const supabase = createClient();

    const {data, error} = await supabase.from('natures').select().eq('id', id).single();

    console.log(data);

    return data;
}
