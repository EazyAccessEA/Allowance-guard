"use client";

import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { mainnet, arbitrum, base } from "@reown/appkit/networks";
import { cookieStorage, createStorage } from "@wagmi/core";

// 1. Get projectId at https://cloud.reown.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!;

if (!projectId) {
  console.error('WalletConnect Project ID is not defined. Please set NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID in your environment variables.');
  throw new Error('Project ID is not defined');
}

console.log('WalletConnect Project ID loaded:', projectId ? 'Yes' : 'No');
console.log('WalletConnect Project ID value:', projectId);
console.log('Environment:', process.env.NODE_ENV);

// 2. Create a metadata object
const metadata = {
  name: "Allowance Guard",
  description: "Open-source, free tool to view and revoke token approvals safely",
  url: "https://www.allowanceguard.com", // origin must match your domain & subdomain
  icons: [
    "https://www.allowanceguard.com/AG_Logo2.png",
    "https://www.allowanceguard.com/AG_Logo_Grey.png",
    "https://www.allowanceguard.com/android-chrome-192x192.png",
    "https://www.allowanceguard.com/android-chrome-512x512.png"
  ],
};

// 3. Create the Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  projectId,
  networks: [mainnet, arbitrum, base]
});

// 4. Create the AppKit instance - OUTSIDE React component as per docs
try {
  console.log('Initializing AppKit with full configuration...');
  createAppKit({
    adapters: [wagmiAdapter],
    metadata: metadata,
    networks: [mainnet, arbitrum, base],
    projectId,
    features: {
      analytics: false, // Disable analytics to prevent Coinbase API calls
      email: false, // Disable email login
      socials: [], // Disable all social logins to prevent CSP issues
    },
    enableNetworkSwitch: false, // Disable network switching to prevent errors
  });
  console.log('AppKit initialized successfully with full config');
} catch (error) {
  console.error('AppKit initialization failed:', error);
  console.error('Error details:', {
    name: (error as any)?.name,
    message: (error as any)?.message,
    stack: (error as any)?.stack
  });
  
  // Fallback: try to initialize with minimal config
  try {
    console.log('Trying fallback AppKit configuration...');
    createAppKit({
      adapters: [wagmiAdapter],
      metadata: metadata,
      networks: [mainnet], // Minimal network config
      projectId,
    });
    console.log('AppKit fallback initialization successful');
  } catch (fallbackError) {
    console.error('AppKit fallback initialization also failed:', fallbackError);
    console.error('Fallback error details:', {
      name: (fallbackError as any)?.name,
      message: (fallbackError as any)?.message,
      stack: (fallbackError as any)?.stack
    });
  }
}

export { wagmiAdapter };

export function AppKit({ children }: { children: React.ReactNode }) {
  return <>{children}</>; // AppKit is already initialized above
}