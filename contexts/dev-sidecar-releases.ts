import type { ReleasesResponse, GitHubRelease, GitHubAsset } from "@/lib/dev-sidecar/api";
import { createContext } from "react";

interface ReleasesContextType {
  releases: ReleasesResponse | null;
  os: string | null;
  arch: string | null;
  selectedRelease: GitHubRelease | null;
  selectedAsset: GitHubAsset | null;
}

export const ReleasesContext = createContext<ReleasesContextType>(undefined!);
