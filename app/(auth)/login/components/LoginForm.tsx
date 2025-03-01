'use client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema } from "@/schema/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../../../../components/ui/form";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import SignInWithGoogleButton from "./SignInWithGoogleButton";
import { login } from "@/lib/auth-action";

export default function LoginForm() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      full_name: "",
    }
  });

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: {
    [x: string]: string | Blob; email: string; password: string 
}) => {
    try {
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('full_name', data.full_name);

      await login(formData);
    } catch (error) {
      form.setError('email', { type: 'manual', message: '有効な認証ではありません' });
      form.setError('password', { type: 'manual', message: '有効な認証ではありません' });
      form.setError('full_name',{ type: 'manual', message : 'その名前は登録されていません' });
    }
  };
  
  const togglePassword = () => {
    setShowPassword(!showPassword);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md">
        <h2 className="text-4xl font-popone text-emerald-800 mb-6 text-center ghibli-title">森の入り口</h2>
        <div className="mb-4">
          <Label htmlFor="email" className="block text-emerald-700 font-popone">メールアドレス</Label>
          <Input
            id="email"
            type="email"
            required
            className="w-full px-3 py-2 bg-white/80 border border-emerald-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            {...form.register('email')}
          />
        </div>
        <div className="mb-6 relative">
          <Label htmlFor="password" className="block text-emerald-700 font-popone">パスワード</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              className="w-full px-3 py-2 bg-white/80 border border-emerald-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              {...form.register('password')}
            />
            <button
              type="button"
              onClick={togglePassword}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-emerald-600"
            >
              {showPassword ? <Eye /> : <EyeOff />}
            </button>
          </div>
          <div className="flex justify-between items-center mt-2">
            <SignInWithGoogleButton/> 
          </div>
          {form.formState.errors.password && (
            <p className="text-red-500 text-sm">{form.formState.errors.password.message}</p>
          )}
        </div>
        <div className="flex items-center justify-between mb-4">
          <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105">
            冒険を始める
          </Button>
        </div>
        <div className="text-center">
          <p className="text-emerald-600 font-popone">アカウントをお持ちでないですか？ <Link href="/signup" className="text-emerald-800 hover:underline">登録する</Link></p>
        </div>
      </form>
    </Form>
  );
}