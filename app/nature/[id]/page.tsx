import { getNatureItem } from '@/actions/natures';
import { createClient } from '@/lib/supabase/server';
import { NatureItem } from '@/types/nature';

interface NatureDetailProps {
  params: {
    id: string;
  };
}


const NatureDetail = async ({ params }: NatureDetailProps) => {
  const item = await getNatureItem(params.id);

  if (!item) {
    return <div>アイテムが見つかりませんでした。</div>;
  }

  return (
    <div>
      <h1>{item.title}</h1>
      <img src={item.natureImg} alt={item.title} />
      <p>{item.description}</p>
      <div>
        {item.tags.map((tag, index) => (
          <span key={index}>{tag}</span>
        ))}
      </div>
    </div>
  );
};

export default NatureDetail;
