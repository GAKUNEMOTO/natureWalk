import { getNatureItem, getNatureIds } from '@/actions/natures';
import { getTagLabel } from '@/lib/tag';
import NatureDetailClient from './components/naturedetail';

interface NatureDetailProps {
  params: {
    id: string;
  };
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString();
}

export async function generateStaticParams() {
  const ids = await getNatureIds();  
  return ids.map((id: string) => ({
    id: id,
  }));
}

const NatureDetail = async ({ params }: NatureDetailProps) => {
  const item = await getNatureItem(params.id);

  if (!item) {
    return <div>アイテムが見つかりませんでした。</div>;
  }

  return (
    <div className='p-6'>
      <div className='overflow-hidden border mb-2 rounded'>
        <div className='container py-5'>
          <div className='flex justify-between mb-2'>
            <h1 className='text-3xl font-semibold'>{item.title}</h1>
            <div className='flex flex-col'>
              <p className="text-muted-foreground">作成日</p>
              <div className='text-muted-foreground mt-2'>{formatDate(item.createdAt)}</div>
            </div>
          </div>
          <img src={item.natureImg} alt='' className='w-full h-96 object-contain rounded-sm mb-4'/>
          <h3 className="font-bold text-2xl text-muted-foreground border-b-4">魅力</h3>
          <p className='p-3'>
            {item.description}
          </p>

          <h3 className='font-bold text-2xl text-muted-foreground border-b-4'>場所</h3>
          {item.tags.map((tag, index) => (
            <div key={index} className='bg-muted rounded text-xs px-1 py-1.5 mb-6'>
              <p className="text-xl">
                {getTagLabel(tag)}県
              </p>
            </div>
          ))}
          <NatureDetailClient item={item} />
        </div>
      </div>
    </div>
  );
};

export default NatureDetail;
