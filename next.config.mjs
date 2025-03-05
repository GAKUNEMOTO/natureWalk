/** @type {import('next').NextConfig} */
const nextConfig = {
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
  theme: {
    extend: {
      fontFamily: {
        popone: ["Mochiy Pop One", 'sans-serif'],
      },
    },
  },
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.devtool = 'eval-source-map'
    }
    return config
  }
};

export default nextConfig;
