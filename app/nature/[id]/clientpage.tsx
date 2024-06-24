'use client';

import { useEffect, useState } from 'react';
import { NatureItem } from '@/types/nature';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type Props = {
  params: {
    id: string
  }
}

const supabase = createClient();

const ClientPage = ({ params }: Props) => {
  const [natureItem, setNatureItem] = useState<NatureItem | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchNatureItem = async () => {
      const { data, error } = await supabase
      .from('natures')
      .select('*')
      .eq('id', params.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching data:', error);
      return;
}

if(data) {
  setNatureItem(data);
  console.log('Query result:', data);
} else {}
console.log('No data here');

setNatureItem(data);
    };

    fetchNatureItem();
  }, [params.id]);

  if (!natureItem) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{natureItem.title}</h1>
      <p>{natureItem.description}</p>
    </div>
  );
};

export default ClientPage;

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