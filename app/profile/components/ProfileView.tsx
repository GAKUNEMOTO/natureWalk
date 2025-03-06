'use client';
import { useAuth } from "@/context/AuthContext";
import type { ProfileView } from "@/types/profile";
import { createClient } from "@/utils/supabase/client";
import { useCallback, useEffect, useState } from "react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";


interface ProfileViewProps {
    userId: string;
}

interface FollowStats {
    followingCount: number;
    followersCount: number;
}


export default function ProfileView({userId}: ProfileViewProps) {
    const supabase = createClient();
    const { user } = useAuth();
    const [profile, setProfile] = useState<ProfileView | null>(null);
    const [followStatus, setFollowStatus] = useState<FollowStats>({
        followingCount: 0,
        followersCount: 0
    });
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(false);

    // フォロー統計を取得する関数
    const fetchFollowStats = useCallback(async () => {
        if (!user?.id) return; // userが存在しない場合は早期リターン

        try {
            // フォロー状態の確認
            const { data: followData, error: followError } = await supabase
                .from('follows')
                .select('*')
                .eq('follower_id', user.id)
                .eq('followed_id', userId);

            if (followError) {
                console.error('Error checking follow status:', followError);
                return;
            }

            setIsFollowing(followData && followData.length > 0);

            // フォロー中とフォロワーのカウントを並行して取得
            const [followingResult, followersResult] = await Promise.all([
                supabase
                    .from('follows')
                    .select('followed_id', { count: 'exact' })
                    .eq('follower_id', userId),
                supabase
                    .from('follows')
                    .select('follower_id', { count: 'exact' })
                    .eq('followed_id', userId)
            ]);

            setFollowStatus({
                followingCount: followingResult.count ?? 0,
                followersCount: followersResult.count ?? 0
            });
        } catch (error) {
            console.error('Error in fetchFollowStats:', error);
        }
    }, [user?.id, userId, supabase]);

    // プロフィール情報を取得する関数
    const fetchProfile = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;

            const profileData: ProfileView = {
                ...data,
                favorite_places: data.favorite_places || [],
                favorite_seasons: data.favorite_seasons || [],
                socialMedia: {
                    instagram: data.instagram_url || '',
                    facebook: data.facebook_url || '',
                    twitter: data.twitter_url || ''
                },
                counts: {
                    followers: 0,
                    followings: 0,
                    natures: 0
                }
            };
            setProfile(profileData);
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    }, [userId, supabase]);

    // プロフィール情報の取得
    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    // フォロー統計の取得とリアルタイム更新の設定
    useEffect(() => {
        if (user?.id) {
            fetchFollowStats();

            const followsChannel = supabase
                .channel('follows_changes')
                .on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: 'follows',
                    filter: `followed_id=eq.${userId}`,
                }, () => {
                    fetchFollowStats();
                })
                .subscribe();

            return () => {
                supabase.removeChannel(followsChannel);
            };
        }
    }, [fetchFollowStats, user?.id]);

    const handleFollow = async () => {
        if(!user) return;

        setLoading(true);

        try{
            if(isFollowing) {
                await supabase
                    .from('follows')
                    .delete()
                    .eq('follower_id', user.id)
                    .eq('followed_id', userId);
            } else {
                await supabase
                    .from('follows')
                    .insert([
                        { follower_id: user.id, followed_id: userId }
                    ]);
            }
        
            setIsFollowing(!isFollowing);
            await fetchFollowStats();
        }catch(error){
            console.error('Error following user', error);
            throw new Error('Error following user');
        }finally{
            setLoading(false);
        }
    };

    if (!profile) return <div className="w-full h-screen flex justify-center items-center">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* プロフィール基本情報 */}
            <div className="md:col-span-1">
                <div className="flex flex-col items-center">
                    <Avatar className="h-32 w-32 mb-4">
                        <AvatarImage src={profile.avatar_url || ''} />
                        <AvatarFallback>
                            {profile.full_name?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                    </Avatar>
                    <h1 className="text-2xl font-bold text-center mb-2">
                        {profile.full_name || 'No Name'}
                    </h1>
                    
                    {/* フォロー情報 */}
                    <div className="flex space-x-4 mb-4">
                        <div className="text-center">
                            <div className="font-bold">{followStatus.followingCount}</div>
                            <div className="text-gray-600">フォロー中</div>
                        </div>
                        <div className="text-center">
                            <div className="font-bold">{followStatus.followersCount}</div>
                            <div className="text-gray-600">フォロワー</div>
                        </div>
                    </div>

                    {/* フォローボタン */}
                    {user && user.id !== userId && (
                        <Button
                            onClick={handleFollow}
                            disabled={loading}
                            variant={isFollowing ? "outline" : "default"}
                            className="w-full"
                        >
                            {loading ? 'Loading...' : isFollowing ? 'フォロー中' : 'フォローする'}
                        </Button>
                    )}

                    {/* SNSリンク */}
                    <div className="flex space-x-4 mt-4">
                        {profile.instagram_url && (
                            <a href={profile.instagram_url} target="_blank" rel="noopener noreferrer">
                                <FaInstagram className="h-6 w-6 text-pink-600" />
                            </a>
                        )}
                        {profile.twitter_url && (
                            <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer">
                                <FaTwitter className="h-6 w-6 text-blue-400" />
                            </a>
                        )}
                        {profile.facebook_url && (
                            <a href={profile.facebook_url} target="_blank" rel="noopener noreferrer">
                                <FaFacebook className="h-6 w-6 text-blue-600" />
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* プロフィール詳細情報 */}
            <div className="md:col-span-2">
                {/* 自己紹介 */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">自己紹介</h2>
                    <p className="text-gray-700 whitespace-pre-wrap">
                        {profile.bio || '自己紹介文がありません'}
                    </p>
                </div>

                {/* お気に入りの場所 */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">好きな場所</h2>
                    <div className="flex flex-wrap gap-2">
                        {profile.favorite_places?.map((place) => (
                            <Badge key={place} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                {(place)}
                            </Badge>
                        ))}

                    </div>
                </div>

                {/* お気に入りの季節 */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">好きな季節</h2>
                    <div className="flex flex-wrap gap-2">
                        {profile.favorite_seasons && profile.favorite_seasons.length > 0 ? (
                            profile.favorite_seasons.map((season) => (
                                <span key={season} className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                                    {(season)}
                                </span>
                            ))
                        ) : (
                            <span className="text-gray-500">設定されていません</span>
                        )}
                    </div>
                    <Button variant="outline" className="w-full mt-5">
                    <LayoutDashboard className="w-6 h-6 text-muted-foreground mr-2" />
                        <Link href='/dashboard'>
                        ダッシュボードに戻る
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    </div>
    )


}