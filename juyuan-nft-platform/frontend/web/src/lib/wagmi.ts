import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { mainnet, polygon, arbitrum, polygonMumbai } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: '钜园农业NFT平台',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [
    polygon,
    ...(process.env.NODE_ENV === 'development' ? [polygonMumbai] : []),
  ],
  transports: {
    [polygon.id]: http(),
    [polygonMumbai.id]: http(),
  },
});


