'use client';
import { handleSubmitSignup} from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { signinSchema } from "@/schema/schema";
import { Form } from "@/components/ui/form";
import SignInWithGoogleButton from "../../login/components/SignInWithGoogleButton";
import { signup } from "@/lib/auth-action";

export default function SignUpForm() {
  const form = useForm<z.infer<typeof　signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
      first_name: "",
      last_name: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    try {
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('full_name', data.first_name + " " + data.last_name);

      await signup(formData);
    } catch (error) {
      form.setError('email', { type: 'manual', message: 'メールにエラーが発生しました' });
      form.setError('password', { type: 'manual', message: 'パスワードにエラーが発生しました' });
      form.setError('first_name',{ type: 'manual', message : '名前にエラーが発生しました' });
      form.setError('last_name',{ type: 'manual', message : '名前にエラーが発生しました' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-300 via-green-200 to-yellow-200">
      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 bg-white/30 backdrop-blur-md rounded-3xl shadow-xl transform rotate-6 z-0"></div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="relative bg-white/70 backdrop-blur-sm p-8 rounded-3xl shadow-2xl z-10">
            <h2 className="text-4xl font-popone text-emerald-800 mb-6 text-center ghibli-title">自然の仲間入り</h2>
            <div className="mb-4">
              <Label htmlFor="full_name" className="block text-emerald-700 font-popone">名前</Label>
              <Input
                id="first_name"
                type="text"
                required
                className="w-full px-3 py-2 bg-white/80 border border-emerald-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                {...form.register('first_name')}
              />
              {form.formState.errors.first_name && (
                <p className="text-red-500 text-sm">{form.formState.errors.first_name.message}</p>
              )}
            </div>
            <div className="mb-4">
              <Label htmlFor="last_name" className="block text-emerald-700 font-popone">苗字</Label>
              <Input
                id="last_name"
                type="text"
                required
                className="w-full px-3 py-2 bg-white/80 border border-emerald-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                {...form.register('last_name')}
              />
              {form.formState.errors.last_name && (
                <p className="text-red-500 text-sm">{form.formState.errors.last_name.message}</p>
              )}
            </div>
            <div  className="mb-4">
              <Label htmlFor="email" className="block text-emerald-700 font-popone">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                required
                className="w-full px-3 py-2 bg-white/80 border border-emerald-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                {...form.register('email')}
              />
              {form.formState.errors.email && (
                <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>
              )}
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
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-emerald-600"
                >
                  {showPassword ? <Eye /> : <EyeOff />}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-red-500 text-sm">{form.formState.errors.password.message}</p>
              )}
            </div>
            <SignInWithGoogleButton/>
            <div className="flex items-center justify-between mb-4">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105">
                冒険に参加する
              </Button>
            </div>
            <div className="text-center">
              <p className="text-emerald-600 font-popone">すでにアカウントをお持ちですか？ <Link href="/login" className="text-emerald-800 hover:underline">ログイン</Link></p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}