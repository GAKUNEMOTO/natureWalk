/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
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
