import { login, signup } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function SignInForm() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Welcome to Nature</h2>        
        <div className="mb-4">
          <Label htmlFor="email" className="block text-gray-700">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div className="mb-6">
          <Label htmlFor="password" className="block text-gray-700">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div className="flex items-center justify-between mb-4">
          <Button formAction={signup} className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Sign Up
          </Button>
        </div>
        <div className="text-center">
          <p className="text-gray-600">Don't have an account? <Link href="/signup" className="text-blue-500 hover:underline">Log in</Link></p>
        </div>
      </form>
    </div>
  );
}
