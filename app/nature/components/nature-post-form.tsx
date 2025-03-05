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
import { createClient } from '@/utils/supabase/client';
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
        likes: 0, 
      };

      console.log("Creating item with data:", newItemData);
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-green-800 bg-cover p-8 rounded-3xl shadow-lg font-ghibli">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-green-800 text-xl mb-2'>タイトル</FormLabel>
              <FormControl>
                <Input placeholder="タイトル" {...field} className="border-2 border-ghibli-green rounded-lg p-2 bg-white bg-opacity-80" />
              </FormControl>
              <FormDescription className="text-amber-700 italic">
                最大15文字まで
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-green-800 text-xl mb-2">説明</FormLabel>
              <FormControl>
                <Input placeholder="商品の説明を入力してください" {...field} className="border-2 border-green-600 rounded-lg p-2 bg-white bg-opacity-80" />
              </FormControl>
              <FormDescription className="text-amber-700 italic">
                最大50文字まで
              </FormDescription>
              <FormMessage className="text-red-500"/>
            </FormItem>
          )}
        />
        <FormItem>
          <FormLabel className="text-green-800 text-xl mb-2">画像</FormLabel>
          <FormControl>
            <div {...getRootProps()} className="border-3 border-dashed border-ghibli-green rounded-3xl p-8 text-center cursor-pointer bg-totoro bg-contain bg-no-repeat bg-center min-h-[200px] flex items-center justify-center hover:bg-ghibli-green hover:bg-opacity-10 transition-all duration-300">
              <input {...getInputProps()} />
              <p>ここにファイルをドラッグアンドドロップするか、クリックしてファイルを選択してください。</p>
              {fileName && <p className="mt-4 font-bold">選択されたファイル: {fileName}</p>}
            </div>
          </FormControl>
          <FormDescription className="text-amber-700 italic">
            画像をアップロードしてください
          </FormDescription>
          <FormMessage className="text-red-500" />
        </FormItem>
        <FormItem>
          <FormLabel className="text-green-600 text-xl mb-2">県タグ</FormLabel>
          <FormControl>
            <KenSelecter onSelect={onSelectKenTag}  />
          </FormControl>
        </FormItem>
        <FormItem>
          <FormLabel className='text-green-600 text-xl mb-2'>シーズンタグ</FormLabel>
          <FormControl>
            <SeasonSelecter onSelect={onSelectSeasonTag} />
          </FormControl>
        </FormItem>
        <div className="flex gap-3">
          <Button type="submit" className='bg-green-600 text-white border-none rounded-full px-8 py-2 text-xl cursor-pointer transition-all duration-300  hover:scale-100'>
            投稿
          </Button>
        </div>
      </form>
    </Form>
  );
}
