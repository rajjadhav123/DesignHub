import type { ColorRole } from "@/types/brand";

/** An image prepared for analysis: downscaled pixels plus a preview URL. */
export type DnaImage = {
  name: string;
  /** Object URL for the preview; revoke when done. */
  url: string;
  width: number;
  height: number;
  /** RGBA pixels of a small copy (at most 160 px on the long side). */
  pixels: Uint8ClampedArray;
  sampleWidth: number;
  sampleHeight: number;
};

export type DnaColor = { hex: string; weight: number; role: ColorRole };

/** What a provider returns. Every field is editable before it is applied to the brand. */
export type BrandDna = {
  colors: DnaColor[];
  heading: string;
  body: string;
  personality: string[];
  mood: string;
  radius: number;
  /** 0 to 1, how sure the provider is. Shown, never used for logic. */
  confidence: number;
  notes: string[];
};

export type DnaStage = "reading" | "palette" | "mood" | "type" | "done";

export const dnaStages: { id: DnaStage; label: string }[] = [
  { id: "reading", label: "Reading image" },
  { id: "palette", label: "Extracting palette" },
  { id: "mood", label: "Reading mood" },
  { id: "type", label: "Matching typefaces" },
];

export type DnaOptions = {
  signal?: AbortSignal;
  onStage?: (stage: DnaStage) => void;
  /** Leave a flat background (a logo on white) out of the palette. Providers may ignore it. */
  ignoreBackground?: boolean;
};

/**
 * A source of Brand DNA. Providers run in the browser; one backed by a model would call
 * its API inside `analyze` and map the response onto `BrandDna`. Nothing else changes.
 */
export type BrandDnaProvider = {
  id: string;
  label: string;
  description: string;
  /** Runs entirely on this device, with no network. */
  local: boolean;
  /** Returns mocked data. Surfaced in the UI so it is never mistaken for real analysis. */
  mocked: boolean;
  analyze: (image: DnaImage, options?: DnaOptions) => Promise<BrandDna>;
};
