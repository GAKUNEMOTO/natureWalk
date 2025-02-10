import FallingLeaves from '@/app/animation/fallingleaf'
import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <>
    <FallingLeaves count={50} />
    <div className="h-[calc(100vh-96px)] flex items-center justify-center">
        <SignUp fallbackRedirectUrl={"/dashboard"} />
    </div>
    </>
  )
}