import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup } from "@/lib/auth-action";


export function SignUpForm() {
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action="">
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="last-name">苗字</Label>
                <Input
                  name="last-name"
                  id="last-name"
                  placeholder="自然"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="first-name">お名前</Label>
                <Input
                  name="first-name"
                  id="first-name"
                  placeholder="太郎"
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                name="email"
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">パスワード</Label>
              <Input name="password" id="password" type="password" />
            </div>
            <Button formAction={signup} type="submit" className="w-full">
              アカウントを作成
            </Button>
          </div>
        </form>
        <div className="mt-4 text-center text-sm">
          既にアカウントを持っていますか?{" "}
          <Link href="/login" className="underline">
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}