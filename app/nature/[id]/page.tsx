import { getNatureItem } from '@/actions/natures';
import { getTagLabel } from '@/lib/tag';
import NatureDetailClient from './components/naturedetail';
import { kenTags, seasonTags } from '@/data/tag';

interface NatureDetailProps {
  params: {
    id: string;
  };
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString();
}

const NatureDetail = async ({ params }: NatureDetailProps) => {
  const item = await getNatureItem(params.id);

  if (!item) {
    return <div>アイテムが見つかりませんでした。</div>;
  }

  // タグの形式が配列であると仮定し、タグのフィルタリングを行う
  const placeTags = item.tags.filter((tag: string) => kenTags.some(kenTag => kenTag.id === tag));
  const seasonTagsFiltered = item.tags.filter((tag: string) => seasonTags.some(seasonTag => seasonTag.id === tag));

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
          <img src={item.natureImg} alt='' className='w-full h-96 object-contain rounded-sm mb-4' />
          <h3 className="font-bold text-2xl text-muted-foreground border-b-4">魅力</h3>
          <p className='p-3'>
            {item.description}
          </p>

          <h3 className='font-bold text-2xl text-muted-foreground border-b-4'>場所</h3>
          {placeTags.map((tag, index) => (
            <div key={index} className='bg-muted rounded text-xs px-1 py-1.5 mb-6'>
              <p className="text-xl">
                {getTagLabel(tag)}県
              </p>
            </div>
          ))}

          <h3 className='font-bold text-2xl text-muted-foreground border-b-4'>シーズン</h3>
          {seasonTagsFiltered.map((tag, index) => (
            <div key={index} className='bg-muted rounded text-xs px-1 py-1.5 mb-6'>
              <p className="text-xl">
                {getTagLabel(tag)}
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
