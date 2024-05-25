'use server';
import { currentUser } from "@/data/auth";
import { createClient } from "@/lib/supabase/server";
import { TablesInsert, Tables } from "@/types/database";

export const createItem = async (formData: TablesInsert<'natures'>): Promise<Tables<'natures'>> => {
  const supabase = createClient();
  const user = await currentUser();

  if (!user) {
    throw new Error('ログインしてください');
  }

  const formDataWithUserId = {
    ...formData,
    user_id: user.id,
  }
  
  const { data, error } = await supabase.from("natures").insert(formDataWithUserId).select().single();

  

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const deleteItem = async (id: number) => {
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
