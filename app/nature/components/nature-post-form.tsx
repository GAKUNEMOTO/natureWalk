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
import { createItem } from '@/actions/natures';
import { useNatureContext } from '@/context/NatureContext';
import { FormData } from '@/types/form-data';
import Uploader from './uploader';

export const formSchema = z.object({
  title: z.string().min(1, "タイトルは必須です").max(15, "タイトルは最大15文字までです"),
  description: z.string().min(1, "説明は必須です").max(50, "説明は最大50文字までです"),
  natureImg: z.string()
});


export default function ItemForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { addNatureItem } = useNatureContext();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      natureImg: '',
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const newItem = await createItem(data);
      addNatureItem(newItem);
      toast({
        title: 'シェアしました',
        description: "投稿一覧をご確認ください",
      });
      form.reset();
      router.push('/dashboard'); 


    } catch (error) {
      toast({
        variant: "destructive",
        title: "エラーが発生しました。",
        description: "管理者に連絡してください",
      });
    }

  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
        <Uploader/>
        <div className="flex gap-3">
          <Button type="submit">{'投稿'}</Button>
        </div>
      </form>
    </Form>
  );
}
