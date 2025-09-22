"use client";

import { useEffect, useRef, PropsWithChildren } from "react";
import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { mainnet, arbitrum, base } from "@reown/appkit/networks";

const networks = [mainnet, arbitrum, base];
const PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

let inited = false;

export const wagmiAdapter = new WagmiAdapter({
  ssr: true,
  projectId: PROJECT_ID!,
  networks
});

export function AppKitProvider({ children }: PropsWithChildren) {
  const booted = useRef(false);

  useEffect(() => {
    if (booted.current || inited) return;

    const appUrl =
      typeof window !== 'undefined'
        ? window.location.origin
        : (process.env.NEXT_PUBLIC_APP_URL || 'https://www.allowanceguard.com');

    if (!PROJECT_ID) {
      console.warn("WalletConnect PROJECT_ID missing; connect disabled.");
      booted.current = true;
      return;
    }

    createAppKit({
      adapters: [wagmiAdapter],
      metadata: {
        name: "Allowance Guard",
        description: "Open-source, free tool to view and revoke token approvals safely",
        url: appUrl,
        icons: [
          `${appUrl}/AG_Logo2.png`,
          `${appUrl}/AG_Logo_Grey.png`,
          `${appUrl}/android-chrome-192x192.png`,
          `${appUrl}/android-chrome-512x512.png`
        ],
      },
      projectId: PROJECT_ID,
      features: { analytics: false }
    });

    inited = true;
    booted.current = true;
  }, []);

  return <>{children}</>;
}
