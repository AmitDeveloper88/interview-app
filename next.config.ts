import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export", // Commented out to allow Server Actions (Auto-Save in Admin Panel). 
                       // Uncomment this line if you need a purely static export for GitHub Pages 
                       // (Note: Auto-Save will stop working in static mode).
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
