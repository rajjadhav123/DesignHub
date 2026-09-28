import { detectBackground, extractPalette, hexOf, type WeightedColor } from "@/lib/brand-dna/palette";
import type { BrandDna, BrandDnaProvider, DnaColor, DnaOptions } from "@/lib/brand-dna/types";

type Mood = { id: string; personality: string[]; heading: string; body: string; radius: number };

const moods: Record<string, Mood> = {
  vibrant: {
    id: "Vibrant",
    personality: ["Bold", "Energetic", "Playful"],
    heading: "Space Grotesk",
    body: "Inter",
    radius: 14,
  },
  calm: { id: "Calm", personality: ["Friendly", "Clear", "Warm"], heading: "Nunito", body: "Nunito Sans", radius: 16 },
  elegant: {
    id: "Elegant",
    personality: ["Refined", "Confident", "Timeless"],
    heading: "Playfair Display",
    body: "Source Sans 3",
    radius: 4,
  },
  technical: {
    id: "Technical",
    personality: ["Precise", "Reliable", "Direct"],
    heading: "IBM Plex Sans",
    body: "IBM Plex Sans",
    radius: 6,
  },
  minimal: { id: "Minimal", personality: ["Clear", "Honest", "Focused"], heading: "Inter", body: "Inter", radius: 8 },
};

function readMood(colors: WeightedColor[]): Mood {
  const chromatic = colors.filter((item) => item.color.c >= 0.05);
  const chroma = chromatic.reduce((sum, item) => sum + item.color.c * item.weight, 0);
  const lightness = colors.reduce((sum, item) => sum + item.color.l * item.weight, 0);
  const hue = chromatic[0]?.color.h ?? 0;
  if (chromatic.length === 0) return moods.minimal!;
  if (chroma > 0.08) return moods.vibrant!;
  if (lightness < 0.35) return moods.elegant!;
  if (hue > 180 && hue < 270) return moods.technical!;
  return moods.calm!;
}

const wait = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });

/** Heuristic analysis that never leaves the browser. */
export const localProvider: BrandDnaProvider = {
  id: "local",
  label: "On-device",
  description:
    "Extracts the palette and suggests type, radius and personality with simple heuristics. Free, private, instant.",
  local: true,
  mocked: false,
  async analyze(image, options: DnaOptions = {}) {
    const { signal, onStage, ignoreBackground = true } = options;
    onStage?.("reading");
    await wait(120, signal);
    onStage?.("palette");
    const background = ignoreBackground ? detectBackground(image.pixels, image.sampleWidth, image.sampleHeight) : null;
    let palette = extractPalette(image.pixels, 6, { exclude: background });
    // An image that is nothing but its background (a blank canvas) still gets a palette.
    if (palette.length === 0 && background) palette = extractPalette(image.pixels, 6);
    if (palette.length === 0) throw new Error("The image is fully transparent.");
    await wait(160, signal);
    onStage?.("mood");
    const mood = readMood(palette);
    await wait(160, signal);
    onStage?.("type");
    await wait(120, signal);

    // Most colorful becomes primary, the next secondary, grays are neutrals.
    const byChroma = [...palette].sort((a, b) => b.color.c - a.color.c);
    const primary = byChroma[0];
    const secondary = byChroma.find((item) => item !== primary && item.color.c >= 0.05);
    const colors: DnaColor[] = palette.map((item) => ({
      hex: hexOf(item.color),
      weight: item.weight,
      role:
        item === primary ? "primary" : item === secondary ? "secondary" : item.color.c < 0.05 ? "neutral" : "secondary",
    }));
    const result: BrandDna = {
      colors,
      heading: mood.heading,
      body: mood.body,
      personality: mood.personality,
      mood: mood.id,
      radius: mood.radius,
      confidence: Math.min(0.9, 0.45 + palette.length * 0.07),
      notes: [
        `${palette.length} distinct colors found in ${image.sampleWidth * image.sampleHeight} sampled pixels.`,
        `Mood reads as ${mood.id.toLowerCase()} from overall chroma and lightness.`,
        ...(background ? [`Left out the ${hexOf(background)} background.`] : []),
      ],
    };
    onStage?.("done");
    return result;
  },
};
