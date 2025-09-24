import { z } from "zod";

// Base network schema
export const NetworkBaseZ = z.object({
  chainId: z.number().int().positive(),
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500).optional(),
  features: z.array(z.string()).default([])
});

// Supported network schema
export const SupportedNetworkZ = NetworkBaseZ.extend({
  status: z.literal("live"),
  since: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
});

// Planned network schema
export const PlannedNetworkZ = NetworkBaseZ.extend({
  targetMonth: z.string().regex(/^\d{4}-\d{2}$/, "Target month must be in YYYY-MM format")
});

// Changelog entry schema
export const ChangelogEntryZ = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  added: z.array(z.number().int().positive()).default([]),
  notes: z.string().min(1).max(1000).default(""),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, "Version must be in semver format").optional()
});

// Metadata schema
export const NetworksMetadataZ = z.object({
  lastUpdated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  nextReview: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, "Version must be in semver format")
});

// Main networks schema
export const NetworksZ = z.object({
  supported: z.array(SupportedNetworkZ),
  planned: z.array(PlannedNetworkZ),
  changelog: z.array(ChangelogEntryZ),
  metadata: NetworksMetadataZ
});

// Type exports
export type NetworkBase = z.infer<typeof NetworkBaseZ>;
export type SupportedNetwork = z.infer<typeof SupportedNetworkZ>;
export type PlannedNetwork = z.infer<typeof PlannedNetworkZ>;
export type ChangelogEntry = z.infer<typeof ChangelogEntryZ>;
export type NetworksMetadata = z.infer<typeof NetworksMetadataZ>;
export type Networks = z.infer<typeof NetworksZ>;

// Validation helper
export function validateNetworksData(data: unknown): Networks {
  return NetworksZ.parse(data);
}

// Utility schemas for API responses
export const NetworkSummaryZ = z.object({
  chainId: z.number().int().positive(),
  name: z.string(),
  status: z.enum(["live", "planned"]),
  since: z.string().optional(),
  targetMonth: z.string().optional(),
  description: z.string().optional(),
  features: z.array(z.string()).default([])
});

export type NetworkSummary = z.infer<typeof NetworkSummaryZ>;

// API response schemas
export const NetworksApiResponseZ = z.object({
  supported: z.array(NetworkSummaryZ),
  planned: z.array(NetworkSummaryZ),
  changelog: z.array(ChangelogEntryZ),
  metadata: NetworksMetadataZ
});

export type NetworksApiResponse = z.infer<typeof NetworksApiResponseZ>;
