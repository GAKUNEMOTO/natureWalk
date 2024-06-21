import { createClient } from '@/lib/supabase/server';
import { NatureItem } from '@/types/nature';
import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createClient();
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid ID' });
  }

  const { data, error } = await supabase.from('natures').select().eq('id', parseInt(id)).single();

  if (error || !data) {
    return res.status(404).json({ message: 'Item not found' });
  }

  return res.status(200).json(data as NatureItem);
}
