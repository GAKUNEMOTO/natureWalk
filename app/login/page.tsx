import LoginForm from "@/components/login-form";
import { currentUser } from "@/data/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = currentUser();

  if(await user){
    redirect('/dashboard');
  }
  return (
    <div>
        <LoginForm/>
    </div>
  )
}