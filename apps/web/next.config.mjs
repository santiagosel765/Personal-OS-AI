/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Permite resolver paquetes del workspace (apps + packages)
  transpilePackages: ['@personal-os/shared'],
};

export default nextConfig;
