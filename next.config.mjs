import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  outputFileTracingRoot: projectRoot,
  turbopack: {
    root: projectRoot,
  },
  async redirects() {
    return [
      { source: "/iching", destination: "/", permanent: true },
      { source: "/iching/ask", destination: "/ask", permanent: true },
      {
        source: "/iching/hexagrams/:path*",
        destination: "/hexagrams/:path*",
        permanent: true,
      },
      { source: "/iching/card/:path*", destination: "/card/:path*", permanent: true },
      { source: "/iching/formal", destination: "/formal", permanent: true },
      { source: "/iching/dice", destination: "/dice", permanent: true },
    ];
  },
};

export default nextConfig;
