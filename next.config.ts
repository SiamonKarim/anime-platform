/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.myanimelist.net' },
      { protocol: 'https', hostname: 's4.anilist.co' },
      { protocol: 'https', hostname: 'img.flawless.me' },
    ],
  },
  // This allows the video player to work correctly in production
  transpilePackages: ['@vidstack/react'],
};

export default nextConfig;