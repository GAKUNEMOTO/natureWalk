'use server';

import { createClient } from "@/utils/supabase/server";

export const toggleLike = async (natureId: number) => {
    const supabase = createClient();

    const {data: {user}} = await supabase.auth.getUser();

    if (!user) {
        throw new Error('ログインしてください');
    }

    const { data: existingLike, error: checkError } = await supabase
        .from('likes')
        .select('id')
        .eq('nature_id', natureId)
        .eq('user_id', user.id);

        if (checkError && checkError.code !== 'PGRST116') {
            throw checkError;
          }

          if(existingLike && existingLike.length > 0){
            const { error: deleteError } = await supabase
            .from('likes')
            .delete()
            .eq('user_id', user.id)
            .eq('nature_id', natureId);
      
          if (deleteError) throw deleteError;
          return { liked: false };
          } else{
            const { error: insertError } = await supabase
            .from('likes')
            .insert([{ user_id: user.id, nature_id: natureId }]); 

                if (insertError) throw insertError;
                return { liked: true };
          }

}

export async function getLikeCount(natureId: number) {
    const supabase = createClient();
  
    const { data: { user } } = await supabase.auth.getUser();
  
    // Get total like count for this nature item
    const { count, error: countError } = await supabase
      .from('likes')
      .select('*', { count: 'exact' })
      .eq('nature_id', natureId);
  
    if (countError) throw countError;
  
    // Check if current user has liked this item
    const { data: userLike, error: likeError } = await supabase
      .from('likes')
      .select('*')
      .eq('user_id', user?.id || '')
      .eq('nature_id', natureId)
      .single();
  
    if (likeError && likeError.code !== 'PGRST116') {
      throw likeError;
    }
  
    return {
      count: count || 0,
      isLiked: !!userLike
    };
  }