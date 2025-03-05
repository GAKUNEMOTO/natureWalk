'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function handleSubmitLogin(formData: FormData) {
  const supabase = createClient();

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    throw new Error('Invalid email or password');
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}



export async function handleSubmitSignup(formData: FormData) {
 const supabase = createClient();

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    return redirect('/error');
  }

  await revalidatePath('/');
  return redirect('/dashboard');
}


export const signOut = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect('/login'); 
};

