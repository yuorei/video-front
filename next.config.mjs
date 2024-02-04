/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
        domains: ['video-storage.yuorei.com'],
    },
};

export default nextConfig;
