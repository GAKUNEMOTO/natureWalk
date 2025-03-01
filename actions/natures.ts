'use server';

import { createClient } from "@/utils/supabase/server";
import { currentUser } from "@/data/auth";
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

export const getNatures = async (): Promise<NatureItem[]> => {
  const supabase = createClient();
  const { data, error } = await supabase.from('natures').select();

  if (error) {
    console.error(error);
    return [];
  }

  return data.map((item) => ({
    ...item,
    tags: item.tags || [] 
  })) as NatureItem[];
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

export const getNatureIds = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.from('natures').select('id');

  if (error) {
    throw new Error(error.message);
  }

  return data.map((item) => item.id);
};