// app/profile/[id]/page.tsx
import { createClient } from "@/utils/supabase/server";
import ProfileView from "../components/ProfileView";
import ProfileForm from "../components/ProfileForm";

export default async function ProfilePage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    // paramsが準備できていることを確認
    const profileId = params?.id;

    if (!profileId) {
        return <div>Invalid profile ID</div>;
    }

    if (error) {
        console.error('Auth error:', error);
        return <div>Authentication error</div>;
    }

    // 自分のプロフィールの場合は編集フォームを表示
    if (user?.id === profileId) {
        return (
            <div className="w-full min-h-screen py-8 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
                <div className="w-full max-w-4xl mx-auto">
                    <ProfileForm />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen py-8 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
            <div className="w-full max-w-4xl mx-auto">
                <ProfileView userId={profileId} />
            </div>
        </div>
    );
}