/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['gateway.pinata.cloud', 'ipfs.io', 'example.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.ipfs.dweb.link',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    NEXT_PUBLIC_NFT_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS,
    NEXT_PUBLIC_PRESALE_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_PRESALE_CONTRACT_ADDRESS,
    NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS,
  },
};

module.exports = nextConfig;


