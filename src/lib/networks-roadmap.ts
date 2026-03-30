import fs from "node:fs";
import path from "node:path";
import { NetworksZ, type Networks, type NetworksApiResponse, type NetworkSummary } from "./schemas/networks";

/**
 * Read and validate networks roadmap data from JSON file
 */
export function readNetworksRoadmap(): Networks {
  try {
    const filePath = path.join(process.cwd(), "data", "networks.json");
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = JSON.parse(raw);
    return NetworksZ.parse(parsed);
  } catch (error) {
    console.error("Failed to read networks roadmap:", error);
    throw new Error("Invalid networks roadmap data");
  }
}

/**
 * Get networks data formatted for API responses
 */
export function getNetworksApiResponse(): NetworksApiResponse {
  const data = readNetworksRoadmap();
  
  const supported: NetworkSummary[] = data.supported.map(network => ({
    chainId: network.chainId,
    name: network.name,
    status: "live" as const,
    since: network.since,
    description: network.description,
    features: network.features
  }));

  const planned: NetworkSummary[] = data.planned.map(network => ({
    chainId: network.chainId,
    name: network.name,
    status: "planned" as const,
    targetMonth: network.targetMonth,
    description: network.description,
    features: network.features
  }));

  return {
    supported,
    planned,
    changelog: data.changelog,
    metadata: data.metadata
  };
}

/**
 * Get all supported chain IDs
 */
export function getSupportedChainIds(): number[] {
  const data = readNetworksRoadmap();
  return data.supported.map(network => network.chainId);
}

/**
 * Get all planned chain IDs
 */
export function getPlannedChainIds(): number[] {
  const data = readNetworksRoadmap();
  return data.planned.map(network => network.chainId);
}

/**
 * Check if a chain ID is supported
 */
export function isChainSupported(chainId: number): boolean {
  return getSupportedChainIds().includes(chainId);
}

/**
 * Check if a chain ID is planned
 */
export function isChainPlanned(chainId: number): boolean {
  return getPlannedChainIds().includes(chainId);
}

/**
 * Get network info by chain ID
 */
export function getNetworkInfo(chainId: number): NetworkSummary | null {
  const data = readNetworksRoadmap();
  
  // Check supported networks first
  const supported = data.supported.find(network => network.chainId === chainId);
  if (supported) {
    return {
      chainId: supported.chainId,
      name: supported.name,
      status: "live",
      since: supported.since,
      description: supported.description,
      features: supported.features
    };
  }

  // Check planned networks
  const planned = data.planned.find(network => network.chainId === chainId);
  if (planned) {
    return {
      chainId: planned.chainId,
      name: planned.name,
      status: "planned",
      targetMonth: planned.targetMonth,
      description: planned.description,
      features: planned.features
    };
  }

  return null;
}

/**
 * Get recent changelog entries (last N entries)
 */
export function getRecentChangelog(limit: number = 5) {
  const data = readNetworksRoadmap();
  return data.changelog
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

/**
 * Get networks by status
 */
export function getNetworksByStatus(status: "live" | "planned"): NetworkSummary[] {
  const data = readNetworksRoadmap();
  
  if (status === "live") {
    return data.supported.map(network => ({
      chainId: network.chainId,
      name: network.name,
      status: "live" as const,
      since: network.since,
      description: network.description,
      features: network.features
    }));
  } else {
    return data.planned.map(network => ({
      chainId: network.chainId,
      name: network.name,
      status: "planned" as const,
      targetMonth: network.targetMonth,
      description: network.description,
      features: network.features
    }));
  }
}

/**
 * Validate that the networks data is up to date
 */
export function validateNetworksDataFreshness(): { isFresh: boolean; daysSinceUpdate: number } {
  const data = readNetworksRoadmap();
  const lastUpdated = new Date(data.metadata.lastUpdated);
  const now = new Date();
  const daysSinceUpdate = Math.floor((now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24));
  
  // Consider data fresh if updated within last 30 days
  return {
    isFresh: daysSinceUpdate <= 30,
    daysSinceUpdate
  };
}
