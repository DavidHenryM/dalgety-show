import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home', // The page to redirect to
        permanent: true, // true = 308 permanent redirect, false = 307 temporary
      },
    ]
  }
}


export default nextConfig;
