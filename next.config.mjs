/** @type {import('next').NextConfig} */
const nextConfig = {
    remotePatterns: [
        {
          protocol: 'http',
          hostname: '127.0.0.1',
          port: '54321',
          pathname: '/storage/v1/object/public/nature/**',
        },
      ],
};

export default nextConfig;
