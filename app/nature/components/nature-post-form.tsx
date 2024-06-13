'use client';

import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { createItem } from '@/actions/natures';
import { useNatureContext } from '@/context/NatureContext';
import KenSelecter from './ken-selecter';
import SeasonSelecter from './season-selector';
import { NatureFormData } from '@/types/nature';
import { formSchema, sanitizeFileName } from '@/schema/schema';

export default function ItemForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { addNatureItem } = useNatureContext();
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [selectedKenTag, setSelectedKenTag] = useState<string | null>(null);
  const [selectedSeasonTag, setSelectedSeasonTag] = useState<string | null>(null);

  const form = useForm<NatureFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      natureImg: '',
      tags: [],
    },
  });

  const onDrop = (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
    setFileName(selectedFile.name);
    form.setValue('natureImg', selectedFile);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const onSelectKenTag = (value: string) => {
    setSelectedKenTag(value);
    form.setValue('tags', [value, ...form.getValues('tags').filter((tag: string) => tag !== value)]);
  };

  const onSelectSeasonTag = (value: string) => {
    setSelectedSeasonTag(value);
    form.setValue('tags', [value, ...form.getValues('tags').filter(tag => tag !== value)]);
  };

  const onSubmit: SubmitHandler<NatureFormData> = async (data) => {
    console.log("Form submitted with data:", data);
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

      console.log("Creating item with data:", newItemData);
      const newItem = await createItem(newItemData);

      addNatureItem({
        ...newItem,
        tags: newItem.tags ?? [],
        map: function (arg0: (item: any) => { id: any; }): unknown {
          throw new Error('Function not implemented.');
        }
      });
      toast({
        title: 'シェアしました',
        description: "投稿一覧をご確認ください",
      });
      form.reset();
      setFile(null);
      setFileName(null);
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
            <div {...getRootProps()} className="dropzone">
              <input {...getInputProps()} />
              <p>ここにファイルをドラッグアンドドロップするか、クリックしてファイルを選択してください。</p>
              {fileName && <p>選択されたファイル: {fileName}</p>}
            </div>
          </FormControl>
          <FormDescription>
            画像をアップロードしてください
          </FormDescription>
          <FormMessage />
        </FormItem>
        <FormItem>
          <FormLabel>県タグ</FormLabel>
          <FormControl>
            <KenSelecter onSelect={onSelectKenTag} />
          </FormControl>
        </FormItem>
        <FormItem>
          <FormLabel>シーズンタグ</FormLabel>
          <FormControl>
            <SeasonSelecter onSelect={onSelectSeasonTag} />
          </FormControl>
        </FormItem>
        <div className="flex gap-3">
          <Button type="submit">
            投稿
          </Button>
        </div>
      </form>
    </Form>
  );
}
