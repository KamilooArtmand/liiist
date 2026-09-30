/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@liiist/ui", "@liiist/database"],
  images: {
    domains: ["liii.st", "liiist.app"],
  },
};

export default nextConfig;
