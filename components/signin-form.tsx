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
import { Form } from "./ui/form";
import { signinSchema } from "@/schema/schema";

// スキーマの定義


export default function SignUpForm() {
  const form = useForm<z.infer<typeof　signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
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

      await handleSubmitSignup(formData);
    } catch (error) {
      form.setError('email', { type: 'manual', message: 'An error occurred during signup' });
      form.setError('password', { type: 'manual', message: 'An error occurred during signup' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Welcome to Nature</h2>
          <div className="mb-4">
            <Label htmlFor="email" className="block text-gray-700">Email</Label>
            <Input
              id="email"
              type="email"
              required
              className="w-full px-3 py-2 border rounded-md"
              {...form.register('email')}
            />
            {form.formState.errors.email && (
              <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>
            )}
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
                onClick={togglePasswordVisibility}
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
              Sign Up
            </Button>
          </div>
          <div className="text-center">
            <p className="text-gray-600">Already have an account? <Link href="/login" className="text-blue-500 hover:underline">Log in</Link></p>
          </div>
        </form>
      </Form>
    </div>
  );
}
