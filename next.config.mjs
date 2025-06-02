/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            'localhost',
            'contentsprout.com',
        ],
    },
    typescript: {
        ignoreBuildErrors: false,
    },
    eslint: {
        ignoreDuringBuilds: false,
    },
}

export default nextConfig;
