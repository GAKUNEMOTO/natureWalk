'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { ProfileView } from '@/types/profile';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
export default function ProfileForm(){
    const { user, isLoading } = useAuth();
    const [profile, setProfile] = useState<ProfileView | null>(null);
    const supabase = useMemo(() => createClient(), []);
    const [isrefresh, setIsRefresh] = useState(0);

    useEffect(() => {

        if(isLoading){
            return
        }

        if(!user){
            console.log('User not found');
            return;
        }

        const fetchProfile = async () => {
            try{
            const {data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user?.id)
                .single();
            
                if(error){
                    console.error('Error fetching profile:', error.message);
                } else {
                    setProfile(data);
                }

                const viewData: ProfileView = {
                    ...data,
                    socialMedia: {
                      instagram: data.instagram_url,
                      facebook: data.facebook_url,
                      twitter: data.twitter_url,
                    },
                    counts: {
                      followers: data.followers ?? 0,
                      followings: data.followings ?? 0,
                      natures: data.natures ?? 0,
                    },
                    tags: {
                      places: data.favorite_place || [],
                      seasons: data.favorite_season || [],
                    },
                  };
            setProfile(viewData);
            console.log('Profile:', viewData);
        } catch (err) {
            throw new Error('Error fetching profile');
            }

        }
        fetchProfile();
    }, [supabase, user, isrefresh]);

    const refreshhandler = () => {
        setIsRefresh((prev) => prev + 1);
        console.log('Refreshed');
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
                src={profile.avatar_url || '/placeholder.svg?height=96&width=96'}
                alt={profile.full_name || 'Avatar'}
              />
              <AvatarFallback className="text-2xl">
                {profile.full_name ? profile.full_name.charAt(0) : '?'}
              </AvatarFallback>
            </Avatar>
          </div>
  
          <div className="text-center">
            <h2 className="text-xl font-bold">@{profile.full_name}</h2>
            <p className="text-muted-foreground text-sm mt-1">{profile.bio}</p>
          </div>
        </CardHeader>
  
        <CardContent className="space-y-6">
          {/* SNS リンク */}
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
              <span className="sr-only">Twitter</span>
            </a>
          </div>
  
          {/* 編集ページへのリンク */}
          <div className="flex gap-2 pt-2">
            <Button className="w-full">
              <Link href="/profile/edit">Edit Profile</Link>
            </Button>
            <Button variant="outline" className="w-full">
              Share Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    )
}