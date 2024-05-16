'use client';

import React from 'react';
import { z } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { createItem, deleteItem, updateItem } from '@/actions/natures';

const formSchema = z.object({
    title: z.string().min(1, "タイトルは必須です").max(15, "タイトルは最大15文字までです"),
    description: z.string().min(1, "説明は必須です").max(50, "説明は最大50文字までです"),
    imgUrl: z.string().url("有効なURLを入力してください"),
    place: z.string().min(1, "場所は必須です").max(50, "場所は最大50文字までです"),
});

type FormData = z.infer<typeof formSchema>;

type Props = {
  defaultValues: FormData;
  updateMode: true;
  id: number;
} | {
  defaultValues?: undefined;
  updateMode?: undefined;
  id?: undefined;
};

export default function ItemForm({
    defaultValues,
    updateMode,
    id,
}: Props) {
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: updateMode ? defaultValues : {
          title: '',
          description: '',
          imgUrl: '',
          place: ''
        },
    });

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        if (updateMode && id !== undefined) {
            try {
                await updateItem(id, data);
                toast({
                    title: "更新しました",
                    description: "アイテム一覧を確認してみてください。",
                });
                form.reset();
                router.push('/dashboard'); // リダイレクト
            } catch {
                toast({
                    variant: "destructive",
                    title: "エラーが発生しました。",
                    description: "管理者に連絡してください",
                });
            }
        } else {
            try {
                await createItem(data);
                toast({
                    title: "投稿しました",
                    description: "アイテム一覧を確認してみてください。",
                });
                form.reset();
                router.push('/dashboard'); // リダイレクト
            } catch {
                toast({
                    variant: "destructive",
                    title: "エラーが発生しました。",
                    description: "管理者に連絡してください",
                });
            }
        }
    };

    const handleDelete = async () => {
        if (id !== undefined) {
            try {
                await deleteItem(id);
                toast({
                    title: "削除しました",
                    description: "投稿一覧を確認してみてください。",
                });
                router.push('/dashboard'); // リダイレクト
            } catch {
                toast({
                    variant: "destructive",
                    title: "エラーが発生しました。",
                    description: "管理者に連絡してください",
                });
            }
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, () => alert('error'))} className="space-y-8">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>タイトル</FormLabel>
                            <FormControl>
                                <Input placeholder="タイトル" {...field} />
                            </FormControl>
                            <FormDescription>
                                最大15文字まで
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>説明</FormLabel>
                            <FormControl>
                                <Input placeholder="商品の説明を入力してください" {...field} />
                            </FormControl>
                            <FormDescription>
                                最大50文字まで
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="imgUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>画像URL</FormLabel>
                            <FormControl>
                                <Input placeholder="画像URLを入力してください" {...field} />
                            </FormControl>
                            <FormDescription>
                                有効なURLを入力してください
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="place"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>場所</FormLabel>
                            <FormControl>
                                <Input placeholder="場所を入力してください" {...field} />
                            </FormControl>
                            <FormDescription>
                                最大50文字まで
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className='flex gap-3'>
                    <Button type="submit">{updateMode ? '更新' : '投稿'}</Button>
                    {updateMode && (
                        <Button type='button' variant='destructive' onClick={handleDelete}>
                            削除
                        </Button>
                    )}
                </div>
            </form>
        </Form>
    );
}
