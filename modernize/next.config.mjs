const nextConfig = {
    reactStrictMode: false,
    eslint: {
        ignoreDuringBuilds: true,
    },
    env: {
        NEXT_PUBLIC_API: process.env.NEXT_PUBLIC_API,
    },
}

export default nextConfig;

