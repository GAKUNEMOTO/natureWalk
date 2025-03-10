"use client";

import SeasonSelecter from "@/app/nature/components/season-selector";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { profileFormSchema } from "@/schema/schema";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { set, z } from "zod";
import { Camera, X } from "lucide-react"; 
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

// Zod スキーマから型を推論
type ProfileValues = z.infer<typeof profileFormSchema>;

export default function ProfileEditor() {
  const { user, isLoading } = useAuth();
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<string[]>([]);
  const [placeInput, setPlaceInput] = useState("");
  const [seasonInput, setSeasonInput] = useState("");

  // React Hook Form のセットアップ
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange",
  });

  // プロフィール取得
  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      console.log("User not found");
      return;
    }

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error.message);
        return;
      }
      if (!data) {
        console.error("Profile data is null or undefined");
        return;
      }

      // avatar_url
      setAvatarUrl(data.avatar_url || null);

      // full_name を firstName / lastName に分解
      const [last = "", first = "",...rest] = (data.full_name ?? "").split(" ");
      const lastName = rest.length > 0 ? [last, ...rest].join(" ") : last;

      setValue("firstName", first);
      setValue("lastName", lastName);
      setValue("bio", data.bio || "");
      setValue("instagram", data.instagram_url || "");
      setValue("facebook", data.facebook_url || "");
      setValue("twitter", data.twitter_url || "");

      if (data.favorite_places) {
        setSelectedPlaces(data.favorite_places);
      }
      if (data.favorite_seasons) {
        setSelectedSeasons(data.favorite_seasons);
      }
    };
    fetchProfile();
  }, [supabase, user, isLoading, setValue]);

  // アバターアップロード
  async function avatarUploadHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
  
    try {
      // ユニークなファイル名を生成
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
  
      // 画像をアップロード
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("profile")  // バケット名は "profile"
        .upload(filePath, file, { 
          upsert: true,
          contentType: file.type 
        });
      
      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw new Error("Error uploading avatar");
      }
      
      // Public URLを取得
      const { data } = supabase.storage
        .from("profile")
        .getPublicUrl(filePath);
      
      const publicUrl = data?.publicUrl;
      
      if (!publicUrl) {
        throw new Error("Could not get public URL");
      }
  
      // プロフィールを更新
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);
  
      if (updateError) {
        throw new Error("Error updating profile avatar_url");
      }
  
      setAvatarUrl(publicUrl);
      
    } catch (err) {
      console.error("Error uploading avatar:", err);
    }
  }

  // フォーム送信
  async function onSubmit(formData: ProfileValues) {
    if (!user) return;
    setIsSubmitting(true);
  
    try {
      const fullName = `${formData.lastName} ${formData.firstName} `.trim();
      
      // デバッグ用のログ
      console.log('Submitting data:', {
        id: user.id,
        full_name: fullName,
        favorite_places: selectedPlaces,  // カラム名を修正
        favorite_seasons: selectedSeasons,  // カラム名を修正
        bio: formData.bio,
        avatar_url: avatarUrl,
        instagram_url: formData.instagram,
        facebook_url: formData.facebook,
        twitter_url: formData.twitter,
      });
  
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          full_name: fullName,
          favorite_places: selectedPlaces,  // favoritePlaces → favorite_place
          favorite_seasons: selectedSeasons,  // favoriteSeasons → favorite_season
          bio: formData.bio,
          avatar_url: avatarUrl,
          instagram_url: formData.instagram,
          facebook_url: formData.facebook,
          twitter_url: formData.twitter,
        });
  
      if (error) {
        console.error('Supabase error:', error);  // エラーの詳細をログ出力
        throw error;
      }
  
      console.log("Profile updated successfully");
      router.push("/profile");
    } catch (err) {
      console.error("Error updating profile:", err);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleAddPlace = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && placeInput.trim()) {
      e.preventDefault();
      const newPlace = placeInput.trim();
      // 重複チェックを追加
      if (selectedSeasons.includes(newPlace)) {
        // トースト通知や警告メッセージを表示
        alert('この季節は既に追加されています');
      } else {
        setSelectedPlaces([...selectedPlaces, newPlace]);
      }
      setPlaceInput("");
    }
  };
  
  const handleAddSeason = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && seasonInput.trim()) {
      e.preventDefault();
      const newSeason = seasonInput.trim();
      
      if (selectedSeasons.includes(newSeason)) {
        // トースト通知や警告メッセージを表示
        alert('この季節は既に追加されています');
      } else {
        setSelectedSeasons([...selectedSeasons, newSeason]);
      }
      setSeasonInput("");
    }
  };

  const removePlace = (placeToRemove: string) => {
    setSelectedPlaces(selectedPlaces.filter(place => place !== placeToRemove));
  };

  const removeSeason = (seasonToRemove: string) => {
    setSelectedSeasons(selectedSeasons.filter(season => season !== seasonToRemove));
  };

  // ローディング表示
  if (isLoading) {
    return <div>loading....</div>;
  }
  // ログインしていない
  if (!user) {
    return <div>Please log in</div>;
  }

  return (
<Card className="max-w-2xl mx-auto my-8 shadow-md">
      <CardHeader className="space-y-1 border-b pb-6">
        <h1 className="text-2xl font-bold tracking-tight">Edit Profile</h1>
        <p className="text-sm text-muted-foreground">Update your personal information and preferences</p>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6 pt-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
            <div className="relative group">
              <Avatar className="h-24 w-24 border-2 border-primary/10">
                <AvatarImage src={avatarUrl || ""} alt="Profile" />
                <AvatarFallback className="bg-primary/10 text-lg">
                  {/* Use initials if available */}
                  JP
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1.5 cursor-pointer shadow-md hover:bg-primary/90 transition-colors"
              >
                <Camera className="h-4 w-4" />
                <span className="sr-only">Upload avatar</span>
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={avatarUploadHandler}
              />
            </div>
            <div className="space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="自然"
                    {...register("lastName", { required: "Last name is required" })}
                  />
                  {errors.lastName && <p className="text-destructive text-sm">{errors.lastName.message}</p>}
                </div>
              </div>
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="太郎"
                    {...register("firstName", { required: "First name is required" })}
                  />
                  {errors.firstName && <p className="text-destructive text-sm">{errors.firstName.message}</p>}
                </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself"
                  className="resize-none"
                  rows={3}
                  {...register("bio")}
                />
                {errors.bio && <p className="text-destructive text-sm">{errors.bio.message}</p>}
              </div>
            </div>
          </div>

          <Separator />

          {/* Preferences Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Preferences</h2>

            <div className="space-y-3">
              <Label htmlFor="places">Favorite Places</Label>
              <Input
                id="places"
                value={placeInput}
                onChange={(e) => setPlaceInput(e.target.value)}
                onKeyDown={handleAddPlace}
                placeholder="Type a place and press Enter"
              />
              {selectedPlaces.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedPlaces.map((place) => (
                    <Badge key={place} variant="secondary" className="flex items-center gap-1 px-3 py-1.5">
                      {place}
                      <X className="h-3 w-3 cursor-pointer ml-1" onClick={() => removePlace(place)} />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="seasons">Favorite Seasons</Label>
              <Input
                id="seasons"
                value={seasonInput}
                onChange={(e) => setSeasonInput(e.target.value)}
                onKeyDown={handleAddSeason}
                placeholder="Type a season and press Enter"
              />
              {selectedSeasons.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedSeasons.map((season) => (
                    <Badge key={season} variant="secondary" className="flex items-center gap-1 px-3 py-1.5">
                      {season}
                      <X className="h-3 w-3 cursor-pointer ml-1" onClick={() => removeSeason(season)} />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Social Media Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Social Media</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FaInstagram className="h-4 w-4 text-pink-500" />
                  <Label htmlFor="instagram">Instagram</Label>
                </div>
                <Input id="instagram" placeholder="@username" {...register("instagram")} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FaFacebook className="h-4 w-4 text-blue-600" />
                  <Label htmlFor="facebook">Facebook</Label>
                </div>
                <Input id="facebook" placeholder="username" {...register("facebook")} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FaTwitter className="h-4 w-4 text-sky-500" />
                  <Label htmlFor="twitter">Twitter</Label>
                </div>
                <Input id="twitter" placeholder="@username" {...register("twitter")} />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-4 border-t pt-6">
          <Button variant="outline" type="button">
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="min-w-[100px]">
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
