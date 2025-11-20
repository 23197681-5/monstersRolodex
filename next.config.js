/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, 
  images: {
    remotePatterns: [new URL('https://s.sde.globo.com/**')],
  },
};

module.exports = nextConfig;
