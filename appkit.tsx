"use client";

import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { mainnet, arbitrum, base } from "@reown/appkit/networks";
import { cookieStorage, createStorage } from "@wagmi/core";
import { useEffect, useRef } from "react";

// 1. Get projectId at https://cloud.reown.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!;

if (!projectId) throw new Error('Project ID is not defined');

// 2. Create a metadata object
const metadata = {
  name: "Allowance Guard",
  description: "Open-source, free tool to view and revoke token approvals safely",
  url: "https://www.allowanceguard.com", // Fixed URL to match your domain
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

// Global flag to ensure AppKit is only initialized once
let appKitInitialized = false;

export { wagmiAdapter };

export function AppKit({ children }: { children: React.ReactNode }) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current || appKitInitialized) return;

    // 4. Create the AppKit instance
    createAppKit({
      adapters: [wagmiAdapter],
      metadata: metadata,
      networks: [mainnet, arbitrum, base],
      projectId,
      features: {
        analytics: false, // Optional - defaults to your Cloud configuration
      },
    });

    initialized.current = true;
    appKitInitialized = true;
  }, []);

  return <>{children}</>;
}
