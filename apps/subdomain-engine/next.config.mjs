/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@liiist/ui", "@liiist/database"],
  images: {
    domains: ["liii.st", "localhost"],
  },
  // Subdomain routing is handled fully by Middleware,
  // so we don't need complex rewrites here.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
