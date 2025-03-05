/** @type {import('next').NextConfig} */
const nextConfig = {
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
};

export default nextConfig;
