import { z } from 'zod';

export const fileSchema = (typeof window !== "undefined" && typeof File !== "undefined") ? z.instanceof(File) : z.any();

export const formSchema = z.object({
  title: z.string().min(1, "タイトルは必須です").max(15, "タイトルは最大15文字までです"),
  description: z.string().min(1, "説明は必須です").max(200, "説明は最大200文字までです"),
  natureImg: fileSchema,
  tags: z.array(z.string()).min(1, "タグは必須です"),
});

export const sanitizeFileName = (fileName: string) => {
  return fileName.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
};
