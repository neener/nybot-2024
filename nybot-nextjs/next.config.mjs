/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/hd3sdon3/production/**', // Adjust the path to match your setup
      },
    ],
  },
};

export default nextConfig;
