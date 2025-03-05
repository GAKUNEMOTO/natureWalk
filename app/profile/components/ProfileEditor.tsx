"use client";

import { useAuth } from "@/context/AuthContext";
import { profileFormSchema } from "@/schema/schema";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Zod スキーマから型を推論
type ProfileValues = z.infer<typeof profileFormSchema>;

export default function ProfileEditor() {
  const { user, isLoading } = useAuth();
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const [first = "", last = "", ...rest] = (data.full_name ?? "").split(" ");
      const lastName = rest.length > 0 ? [last, ...rest].join(" ") : last;

      setValue("firstName", first);
      setValue("lastName", lastName);
      setValue("bio", data.bio || "");
      setValue("instagram", data.instagram_url || "");
      setValue("facebook", data.facebook_url || "");
      setValue("twitter", data.twitter_url || "");
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
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();

      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          full_name: fullName,
          email: user.email,
          bio: formData.bio,
          avatar_url: avatarUrl,
          instagram_url: formData.instagram,
          facebook_url: formData.facebook,
          twitter_url: formData.twitter,
        });

      if (error) {
        throw new Error("Error updating profile");
      }

      console.log("Profile updated");
      router.push("/profile");
    } catch (err) {
      console.error("Error updating profile:", err);
    } finally {
      setIsSubmitting(false);
    }
  }

  // ローディング表示
  if (isLoading) {
    return <div>loading....</div>;
  }
  // ログインしていない
  if (!user) {
    return <div>Please log in</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold">Edit Profile</h1>

      {/* アバター */}
      <div className="flex items-center space-x-4">
      {avatarUrl ? (
            <Image
                src={avatarUrl}
                alt="Avatar"
                width={80}
                height={80}
                className="rounded-full"
                style={{ objectFit: 'cover' }}
            />
            ) : (
            <div style={{ width: 80, height: 80, background: "#ccc", borderRadius: "50%" }} />
            )}
        <div>
          <label htmlFor="avatar-upload" className="cursor-pointer text-blue-500">
            Select Avatar
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={avatarUploadHandler}
          />
        </div>
      </div>

      {/* firstName */}
      <div>
        <label className="block font-semibold mb-1">First Name</label>
        <input
          className="border border-gray-300 rounded p-2 w-full"
          placeholder="John"
          {...register("firstName")}
        />
        {errors.firstName && (
          <p className="text-red-500 text-sm">{errors.firstName.message}</p>
        )}
      </div>

      {/* lastName */}
      <div>
        <label className="block font-semibold mb-1">Last Name</label>
        <input
          className="border border-gray-300 rounded p-2 w-full"
          placeholder="Doe"
          {...register("lastName")}
        />
        {errors.lastName && (
          <p className="text-red-500 text-sm">{errors.lastName.message}</p>
        )}
      </div>

      {/* bio */}
      <div>
        <label className="block font-semibold mb-1">Bio</label>
        <textarea
          className="border border-gray-300 rounded p-2 w-full"
          placeholder="Tell us about yourself"
          {...register("bio")}
        />
        {errors.bio && (
          <p className="text-red-500 text-sm">{errors.bio.message}</p>
        )}
      </div>

      {/* instagram */}
      <div>
        <label className="block font-semibold mb-1">Instagram</label>
        <input
          className="border border-gray-300 rounded p-2 w-full"
          placeholder="https://instagram.com/yourname"
          {...register("instagram")}
        />
        {errors.instagram && (
          <p className="text-red-500 text-sm">{errors.instagram.message}</p>
        )}
      </div>

      {/* facebook */}
      <div>
        <label className="block font-semibold mb-1">Facebook</label>
        <input
          className="border border-gray-300 rounded p-2 w-full"
          placeholder="https://facebook.com/yourname"
          {...register("facebook")}
        />
        {errors.facebook && (
          <p className="text-red-500 text-sm">{errors.facebook.message}</p>
        )}
      </div>

      {/* twitter */}
      <div>
        <label className="block font-semibold mb-1">Twitter</label>
        <input
          className="border border-gray-300 rounded p-2 w-full"
          placeholder="https://twitter.com/yourname"
          {...register("twitter")}
        />
        {errors.twitter && (
          <p className="text-red-500 text-sm">{errors.twitter.message}</p>
        )}
      </div>

      {/* ボタン */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {isSubmitting ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
