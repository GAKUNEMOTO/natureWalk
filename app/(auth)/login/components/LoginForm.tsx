'use client'
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login } from "@/lib/auth-action"
import SignInWithGoogleButton from "./SignInWithGoogleButton"
import { useState, useTransition } from "react"
import { LoadingButton } from "@/components/LoadingButton"


export function LoginForm() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (formData: FormData) => {
    setError(null)
    startTransition(async () => {
      try{
        await login(formData)
      } catch (err) {
        setError("ログインに失敗しました。メールアドレスとパスワードを確認してください。")
      }
    })
  }


  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-center">ログイン</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">メールアドレス</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">パスワード</Label>
                  <Link href="#" className="ml-auto inline-block text-sm underline">
                    パスワードを忘れましたか？
                  </Link>
                </div>
                <Input id="password" name="password" type="password" required />
              </div>

              <LoadingButton
                type="submit"
                className="w-full"
                loading={isPending}
                loadingText="ログイン中..."
              >
                ログイン
              </LoadingButton>

              {error && (
                <div className="text-red-500 text-sm mt-2">
                  {error}
                </div>
              )}

             {/* <SignInWithGoogleButton/>  */}
            </div>
        </form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
