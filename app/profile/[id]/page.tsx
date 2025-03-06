// app/profile/[id]/page.tsx
import { createClient } from "@/utils/supabase/server";
import ProfileView from "../components/ProfileView";
import ProfileForm from "../components/ProfileForm";


export default async function ProfilePage({ params }: { params: { id: string } }) {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    // 自分のプロフィールの場合は編集フォームを表示
    if (session?.user.id === params.id) {
        return (
            <div className="w-full min-h-screen py-8">
                <ProfileForm />
            </div>
        );
    }

    // 他のユーザーのプロフィールの場合は閲覧用ビューを表示
    return (
        <div className="w-full min-h-screen py-8 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
            <div className="w-full max-w-4xl mx-auto">
                <ProfileView userId={params.id} />
            </div>
        </div>
    );
}