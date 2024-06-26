'use client';
import { handleSubmitLogin } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema } from "@/schema/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "./ui/form";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('password', data.password);

      await handleSubmitLogin(formData);
    } catch (error) {
      form.setError('email', { type: 'manual', message: '有効な認証ではありません' });
      form.setError('password', { type: 'manual', message: '有効な認証ではありません' });
    }
  };
  
  const togglePassword = () => {
    setShowPassword(!showPassword);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back</h2>
          <div className="mb-4">
            <Label htmlFor="email" className="block text-gray-700">Email</Label>
            <Input
              id="email"
              type="email"
              required
              className="w-full px-3 py-2 border rounded-md"
              {...form.register('email')}
            />
          </div>
          <div className="mb-6 relative">
            <Label htmlFor="password" className="block text-gray-700">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                className="w-full px-3 py-2 border rounded-md"
                {...form.register('password')}
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              >
                {showPassword ? <Eye /> : <EyeOff />}
              </button>
            </div>
            {form.formState.errors.password && (
              <p className="text-red-500 text-sm">{form.formState.errors.password.message}</p>
            )}
          </div>
          <div className="flex items-center justify-between mb-4">
            <Button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Log in
            </Button>
          </div>
          <div className="text-center">
            <p className="text-gray-600">Don't have an account? <Link href="/signup" className="text-blue-500 hover:underline">Sign up</Link></p>
          </div>
        </form>
      </Form>
    </div>
  );
}

