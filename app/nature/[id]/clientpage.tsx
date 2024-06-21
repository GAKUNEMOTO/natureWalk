'use client';

import { useEffect, useState } from 'react';
import { NatureItem } from '@/types/nature';
import { useRouter } from 'next/navigation';
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
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
      const { data } = await supabase
        .from('natures')
        .select('*')
        .eq('id', params.id)
        .single();

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
  const { data: nature } = await supabase.from('natures').select('id');

  const paths = nature?.map(({ id }) => ({
    params: { id: id.toString() },
  }));

  return paths;
}
