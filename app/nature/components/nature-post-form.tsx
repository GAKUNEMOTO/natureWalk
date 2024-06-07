'use client';

import React, { useState } from 'react';
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
import { NatureFormData } from '@/types/nature';
import { createClient } from '@/lib/supabase/client';
import KenSelecter from './ken-selecter';
import SeasonSelecter from './season-selector';


const fileSchema = (typeof window !== "undefined" && typeof File !== "undefined") ? z.instanceof(File) : z.any();

export const formSchema = z.object({
  title: z.string().min(1, "タイトルは必須です").max(15, "タイトルは最大15文字までです"),
  description: z.string().min(1, "説明は必須です").max(50, "説明は最大50文字までです"),
  natureImg: fileSchema,
  tags: z.array(z.string()).min(1, "タグは必須です"), // 修正されたスキーマ
});

const sanitizeFileName = (fileName: string) => {
  return fileName.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
};

export default function ItemForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { addNatureItem } = useNatureContext();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedKenTag, setSelectedKenTag] = useState<string | null>(null);
  const [selectedSeasonTag, setSelectedSeasonTag] = useState<string | null>(null);

  const form = useForm<NatureFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      natureImg: '',
      tag: [], 
    },
  });

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      form.setValue('natureImg', selectedFile);
    }
  };

  const onSelectKenTag = (value: string) => {
    setSelectedKenTag(value);
    form.setValue('tag', [value, ...form.getValues('tag').filter((tag: string) => tag !== value)]);
  };

  const onSelectSeasonTag = (value: string) => {
    setSelectedSeasonTag(value);
    form.setValue('tag', [value, ...form.getValues('tag').filter(tag => tag !== value)]);
  };

  const onSubmit: SubmitHandler<NatureFormData> = async (data) => {
    try {
      if (!file) {
        throw new Error("ファイルが選択されていません");
      }

      const sanitizedFileName = sanitizeFileName(file.name);
      const filePath = `nature_img/${Date.now()}_${sanitizedFileName}`;
      const supabase = createClient();
      console.log("Uploading file:", file);
      const { error: uploadError } = await supabase.storage
        .from('nature')
        .upload(filePath, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw new Error(uploadError.message);
      }

      const { data: urlData } = supabase.storage
        .from('nature')
        .getPublicUrl(filePath);

      if (!urlData) {
        throw new Error("Failed to get public URL");
      }

      console.log("File uploaded to:", urlData.publicUrl);

      const newItemData = {
        ...data,
        natureImg: urlData.publicUrl,
        tags: [selectedKenTag, selectedSeasonTag].filter(Boolean) as string[],
      };

      const newItem = await createItem(newItemData);

      addNatureItem({
        ...newItem,
        tags: newItem.tags ?? [],
      });
      toast({
        title: 'シェアしました',
        description: "投稿一覧をご確認ください",
      });
      form.reset();
      setFile(null);
      setPreview(null);
      setSelectedKenTag(null);
      setSelectedSeasonTag(null);
      router.push('/dashboard'); 
    } catch (error) {
      toast({
        variant: "destructive",
        title: "エラーが発生しました。",
        description: (error as Error).message,
      });
      console.error("Submit error:", error);
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
        <FormItem>
          <FormLabel>画像</FormLabel>
          <FormControl>
            <Input type="file" onChange={onFileChange} />
          </FormControl>
          <FormDescription>
            画像をアップロードしてください
          </FormDescription>
          <FormMessage />
        </FormItem>
        
        <FormField
          control={form.control}
            name="tag"
          render={() => (
            <>
              <FormItem>
                <FormLabel>県タグ</FormLabel>
                <KenSelecter onSelect={onSelectKenTag} />
                <FormMessage />
              </FormItem>
              <FormItem>
                <FormLabel>シーズンタグ</FormLabel>
                <SeasonSelecter onSelect={onSelectSeasonTag} />
                <FormMessage />
              </FormItem>
            </>
          )}
        />
        <div className="flex gap-3">
          <Button type="submit">
            {'投稿'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
