'use server';
import { currentUser } from "@/data/auth";
import { createClient } from "@/lib/supabase/server";

import { TablesInsert, Tables } from "@/types/database";
import { NatureItem } from "@/types/nature";

export const createItem = async (formData: TablesInsert<'natures'>): Promise<Tables<'natures'>> => {
  const supabase = createClient();
  const user = await currentUser();

  if (!user) {
    throw new Error('ログインしてください');
  }

  const formDataWithUserId = {
    ...formData,
    user_id: user.id,
  };
  
  const { data, error } = await supabase.from("natures").insert(formDataWithUserId).select().single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getNatureItem = async (id: string): Promise<NatureItem | null> => {
  const supabase = createClient();
  const { data: item, error } = await supabase
    .from('natures')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !item) {
    return null;
  }

  return item;
};

export const deleteNatureItem = async (id: number) => {
  const supabase = createClient();
  const user = await currentUser();

  if (!user) {
    throw new Error('ログインしてください');
  }

  const { error } = await supabase.from("natures").delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
};

