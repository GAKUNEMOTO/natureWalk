export interface ProfileView {
    id: string;
    full_name: string | null;
    bio: string | null;
    avatar_url: string | null;
    // DB に存在する場合はそのまま使い、UI 用にまとめる場合は別途加工する
    instagram_url?: string | null;
    twitter_url?: string | null;
    facebook_url?: string | null;
    // UI 表示用に追加するプロパティ
    socialMedia: {
      instagram: string;
      facebook: string;
      twitter: string;
    };
    counts: {
      followers: number;
      followings: number;
      natures: number;
    };
    tags: {
      places: string[];
      seasons: string[];
    };
  }
  
