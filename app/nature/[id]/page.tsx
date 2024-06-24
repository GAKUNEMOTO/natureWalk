'use client';

import { useParams } from 'next/navigation';
import ClientPage from './clientpage';
import { createClient } from '@/lib/supabase/client';


const Page = () => {
  const params = useParams();
  const id = params.id as string;

  return <ClientPage params={{ id }} />;
};

export default Page;

export async function generateStaticParams() {
  const supabase = createClient();
  const { data: nature, error } = await supabase.from('natures').select('id');

  if (error) {
    console.error('Error fetching static params:', error);
    return [];
  }

  return nature?.map(({ id }) => ({
    id: id.toString(),
  })) || [];
}