'use server';
import { currentUser } from "@/data/auth";
import { createClient } from "@/lib/supabase/server";
import { TablesInsert } from "@/types/database";

export const createItem = async (formData: TablesInsert<'natures'>) => {
    const supabase = createClient();
    const user = await currentUser();

    if (!user) {
        throw new Error('ログインしてください');
    }

    const { error } = await supabase.from("natures").insert(formData);

    if (error) {
        throw new Error(error.message);
    }
};

export const updateItem = async (id: number, formData: TablesInsert<'natures'>) => {
    const supabase = createClient();
    const user = await currentUser();

    if (!user) {
        throw new Error('ログインしてください');
    }

    const { error } = await supabase.from("natures").update(formData).eq('id', id);

    if (error) {
        throw new Error(error.message);
    }
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
