'use client';

import { deleteNatureItem } from '@/actions/natures';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Heart, Share2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { NatureItem } from '@/types/nature';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface NatureDetailClientProps {
  item: NatureItem;
}

export const NatureDetailClient: React.FC<NatureDetailClientProps> = ({ item }) => {
  const router = useRouter()
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  const handleDelete = async () => {
    try {
      await deleteNatureItem(item.id).then(() => {
        router.push('/dashboard');
      });
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  console.log(item);

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount((prev: number) => (isLiked ? prev - 1 : prev + 1))
    // Here you would typically call an API to update the like status
  }

  const formattedDate = item.createdAt
    ? formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: ja })
    : "日付不明"

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
    <div className="flex items-center mb-6">
      <Button variant="ghost" size="sm" className="flex items-center gap-1" asChild>
        <Link href="/dashboard">
          <ArrowLeft className="h-4 w-4" />
          <span>戻る</span>
        </Link>
      </Button>
      <span className="flex-1"></span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className={`flex items-center gap-1 ${isLiked ? "text-rose-500" : ""}`}
          onClick={handleLike}
        >
          <Heart className={`h-4 w-4 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
          <span>{likeCount}</span>
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Share2 className="h-4 w-4" />
          <span>共有</span>
        </Button>
        {item && (
          <>
            <Button variant="outline" size="sm" className="flex items-center gap-1" asChild>
              <Link href={`/dashboard/edit/${item.id}`}>
                <Edit className="h-4 w-4" />
                <span>編集</span>
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1 text-red-500 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                  <span>削除</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
                  <AlertDialogDescription>
                    この操作は元に戻せません。この自然の投稿を削除すると、すべてのデータが完全に削除されます。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>キャンセル</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                    削除する
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </div>

    </div>
    </div>
  );
};


