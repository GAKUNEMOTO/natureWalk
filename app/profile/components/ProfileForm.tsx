'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { ProfileView } from '@/types/profile';
import { createClient } from '@/utils/supabase/client';
import { Calendar, LayoutDashboard, MapPin, UserCheck } from 'lucide-react';
import { Badge } from "@/components/ui/badge"
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import Link from 'next/link';
export default function ProfileForm(){
    const { user, isLoading } = useAuth();
    const [profile, setProfile] = useState<ProfileView | null>(null);
    const supabase = useMemo(() => createClient(), []);
    const [isrefresh, setIsRefresh] = useState(0);
    const [counts, setCounts] = useState({
        followers: 0,
        followings: 0,
        natures: 0,
    });

    const fetchCounts = useCallback(async (userId: string) => {
      try {
          const [followersResult, followingsResult, naturesResult] = await Promise.all([
              supabase
                  .from('follows')
                  .select('follower_id', { count: 'exact' })
                  .eq('followed_id', userId),
              supabase
                  .from('follows')
                  .select('followed_id', { count: 'exact' })
                  .eq('follower_id', userId),
              supabase
                  .from('natures')
                  .select('id', { count: 'exact' })
                  .eq('user_id', userId),
          ]);
          
          setCounts({
              followers: followersResult.count ?? 0,
              followings: followingsResult.count ?? 0,
              natures: naturesResult.count ?? 0,
          });
      } catch (error) {
          console.error('Error fetching counts:', error);
          throw new Error('Error fetching counts');
      }
  }, [supabase]);

    useEffect(() => {
      if(isLoading || !user) return;
  
      const fetchProfile = async () => {
          try {
              const { data, error } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('id', user.id)
                  .single();
              
              if(error) throw error;
  
              if(data) {
                  const viewData: ProfileView = {
                      ...data,
                      favorite_places: data.favorite_places || [],
                      favorite_seasons: data.favorite_seasons || [],
                      socialMedia: {
                          instagram: data.instagram_url || '',
                          facebook: data.facebook_url || '',
                          twitter: data.twitter_url || '',
                      },
                      counts: {
                          followers: counts.followers,
                          followings: counts.followings,
                          natures: counts.natures,
                      },
                  };
                  setProfile(viewData);
              }
          } catch (err) {
              console.error('Error fetching profile:', err);
          }
      };
  
      // 最初にcountsを取得してから、プロフィールを取得
      const initializeData = async () => {
          if (user) {
              await fetchCounts(user.id);
              await fetchProfile();
          }
      };
  
      initializeData();
  
      const followsChannel = supabase
          .channel('follow_changes')
          .on('postgres_changes', {
              event: "*",
              schema: "public",
              table: "follows",
              filter: `follower_id=eq.${user.id} OR followed_id=eq.${user.id}`
          }, async () => {
              await fetchCounts(user.id);
              await fetchProfile(); // countsが更新されたら、プロフィールも更新
          })
          .subscribe();
  
      const natureChannel = supabase
          .channel('nature_changes')
          .on('postgres_changes', {
              event: "*",
              schema: "public",
              table: "natures",
              filter: `user_id=eq.${user.id}`
          }, async () => {
              await fetchCounts(user.id);
              await fetchProfile(); // countsが更新されたら、プロフィールも更新
          })
          .subscribe();
  
      return () => {
          void supabase.removeChannel(followsChannel);
          void supabase.removeChannel(natureChannel);
      };
  }, [supabase, user, isLoading, isrefresh, counts, fetchCounts]);

    const formatCount = (count: number) => {
        if (count >= 1000) {
          return (count / 1000).toFixed(1) + "k"
        }
        return count.toString()
      }

    if(isLoading){
        return <p>Loading...</p>
    }

    if(!profile){
        console.log('Profile not found');
        return null;
    }
    
    return (
        <Card className="max-w-md mx-auto">
      <CardHeader className="flex flex-col items-center space-y-4 pb-2">
        <div className="relative group">
          <Avatar className="w-24 h-24 border-4 border-background">
            <AvatarImage
              src={ profile.avatar_url || "/placeholder.svg?height=96&width=96"}
              alt="Avatar"
            />
            <AvatarFallback className="text-2xl">{profile.full_name ? profile.full_name.substring(0, 2).toUpperCase() : ''}</AvatarFallback>
          </Avatar>
        </div>

        <div className="text-center">
          <h2 className="text-xl font-bold">@{profile.full_name}</h2>
          <p className="text-muted-foreground text-sm mt-1">{profile.bio}</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
      <div className="grid grid-cols-3 gap-4 text-center py-2 border-y">
          <div>
            <p className="font-bold">{formatCount(profile?.counts.followers || 0)}</p>
            <p className="text-xs text-muted-foreground">Followers</p>
          </div>
          <div>
            <p className="font-bold">{formatCount(profile?.counts.followings || 0)}</p>
            <p className="text-xs text-muted-foreground">Following</p>
          </div>
          <div>
            <p className="font-bold">{formatCount(profile?.counts.natures || 0)}</p>
            <p className="text-xs text-muted-foreground">Nature Posts</p>
          </div>
        </div>

            {/* Favorite Places */}
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium">Favorite Nature Places</h3>
            </div>
            <div className="flex flex-wrap gap-2">
                {profile.favorite_places && profile.favorite_places.length > 0 ? (
                    profile.favorite_places?.map((place) => (
                        <Badge key={place} variant="secondary">
                            {place}
                        </Badge>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground">No favorite places added yet</p>
                )}
            </div>
        </div>

        {/* Favorite Seasons */}
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium">Favorite Seasons</h3>
            </div>
            <div className="flex flex-wrap gap-2">
                {profile.favorite_seasons && profile.favorite_seasons.length > 0 ? (
                    profile.favorite_seasons.map((season) => (
                        <Badge key={season} variant="secondary">
                            {season}
                        </Badge>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground">No favorite seasons added yet</p>
                )}
            </div>
        </div>

        {/* Social Media Links */}
        <div className="flex justify-center space-x-4 pt-4">
          <a
            href={profile.socialMedia.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <FaInstagram className="h-6 w-6" />
            <span className="sr-only">Instagram</span>
          </a>
          <a
            href={profile.socialMedia.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <FaFacebook className="h-6 w-6" />
            <span className="sr-only">Facebook</span>
          </a>
          <a
            href={profile.socialMedia.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <FaTwitter className="h-6 w-6" />
            <span className="sr-only">X (Twitter)</span>
          </a>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
        <div className='flex items-center gap-2'>
          <Button className="w-full">
            <UserCheck className="w-6 h-6 text-muted-foreground mr-2 text-white" />
            <Link href="/profile/edit">
             プロフィールを編集
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-2">
        <Button variant="outline" className="w-full">
        <LayoutDashboard className="w-6 h-6 text-muted-foreground mr-2" />
            <Link href='/dashboard'>
            ダッシュボードに戻る
            </Link>
          </Button>
          </div>
        </div>
      </CardContent>
    </Card>
    )
}