/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,

  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? {
      exclude: ['error', 'warn'], 
    } : false,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vchlypfgpqokwytcqzwm.supabase.co',
      }
    ]
  },

  experimental: {
    serverActions: true,
    scrollRestoration: true,
  },

  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },

  webpack: (config, { dev }) => {
    if (dev) {
      config.devtool = 'cheap-module-source-map'; // 開発モードでは推奨設定を使用
    } else {
      config.devtool = 'source-map'; // 本番モードではソース
    }
    
    config.cache = {
      type: 'filesystem',
    }
    
    return config
  },

  generateEtags: false,
  
  api: {
    bodyParser: true,
    externalResolver: true,
  },
};

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Required environment variables are not set');
}

export default nextConfig;