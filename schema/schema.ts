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


export const signinSchema = z.object({
  email: z.string().email({
    message: "有効なメールアドレスを入力ください",
  }),
  password: z 
    .string()
    .min(8, {
      message: "パスワードは少なくとも8文字以上である必要があります。",
    })
    .max(100)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, {
      message:
      "パスワードは少なくとも8文字以上で、1つの大文字、1つの小文字、1つの数字、および1つの特殊文字を含まなければなりません。",
  }),
  first_name: z.string().min(1, {
    message: "有効な名前ではありません",
  }),
  last_name: z.string().min(1, {
    message: "有効な名前ではありません",
  }),
})


export const loginSchema = z.object({
  email: z.string().email({ message: "有効なメールアドレスではありません" }),
  password: z.string().min(1, { message: "有効なパスワードではありません" }),
  full_name: z.string().min(1, { message: "有効な名前ではありません" }),
});

export const profileFormSchema = z.object({
  firstName: z.string().min(1, "名前は必須です"),
  lastName: z.string().min(1, "苗字は必須です。"),
  bio: z.string().max(500, "500文字まで書けます。").optional(),
  favoritePlaces: z.array(z.string()).optional(),
  favoriteSeasons: z.array(z.string()).optional(),
  instagram: z.string().url("Invalid Instagram URL").optional().or(z.literal("")),
  facebook: z.string().url("Invalid Facebook URL").optional().or(z.literal("")),
  twitter: z.string().url("Invalid Twitter URL").optional().or(z.literal("")),
});
