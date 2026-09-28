import { colorDistance, fromHex, toHex } from "@/lib/color/color";
import type { Oklch } from "@/types/color";

export type WeightedColor = { color: Oklch; weight: number };

/** Colors closer than this (OKLab distance) to the background count as background. */
const BACKGROUND_DISTANCE = 0.08;

/**
 * The flat background of an image, if it has one: the most common color around the outer
 * edge, when it covers at least 60% of that ring. Photos and full-bleed art return null.
 */
export function detectBackground(pixels: Uint8ClampedArray, width: number, height: number, ring = 3): Oklch | null {
  const counts = new Map<number, { r: number; g: number; b: number; n: number }>();
  let total = 0;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const onEdge = x < ring || y < ring || x >= width - ring || y >= height - ring;
      if (!onEdge) continue;
      const i = (y * width + x) * 4;
      if ((pixels[i + 3] ?? 0) < 128) continue;
      const r = pixels[i] ?? 0;
      const g = pixels[i + 1] ?? 0;
      const b = pixels[i + 2] ?? 0;
      const key = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4);
      const bucket = counts.get(key);
      if (bucket) {
        bucket.r += r;
        bucket.g += g;
        bucket.b += b;
        bucket.n += 1;
      } else counts.set(key, { r, g, b, n: 1 });
      total += 1;
    }
  }
  if (total === 0) return null;
  const top = [...counts.values()].sort((a, b) => b.n - a.n)[0];
  if (!top || top.n / total < 0.6) return null;
  const channel = (sum: number) =>
    Math.round(sum / top.n)
      .toString(16)
      .padStart(2, "0");
  return fromHex(`#${channel(top.r)}${channel(top.g)}${channel(top.b)}`);
}

/**
 * Dominant colors by bucketing pixels (5 bits per channel), then keeping the most
 * common buckets that are perceptually distinct. Fast enough to run on every upload.
 */
export function extractPalette(
  pixels: Uint8ClampedArray,
  count = 5,
  options: { exclude?: Oklch | null } = {},
): WeightedColor[] {
  const buckets = new Map<number, { r: number; g: number; b: number; n: number }>();
  let total = 0;
  for (let i = 0; i < pixels.length; i += 4) {
    const alpha = pixels[i + 3] ?? 0;
    if (alpha < 128) continue;
    const r = pixels[i] ?? 0;
    const g = pixels[i + 1] ?? 0;
    const b = pixels[i + 2] ?? 0;
    const key = ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3);
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.r += r;
      bucket.g += g;
      bucket.b += b;
      bucket.n += 1;
    } else buckets.set(key, { r, g, b, n: 1 });
    total += 1;
  }
  if (total === 0) return [];

  const ranked = [...buckets.values()]
    .sort((a, b) => b.n - a.n)
    .slice(0, 256)
    .map((bucket) => {
      const hex = `#${[bucket.r, bucket.g, bucket.b]
        .map((sum) =>
          Math.round(sum / bucket.n)
            .toString(16)
            .padStart(2, "0"),
        )
        .join("")}`;
      return { color: fromHex(hex), weight: bucket.n / total, n: bucket.n };
    })
    // Leave out the detected background, then weigh what is left as the whole image.
    .filter((item) => !options.exclude || colorDistance(item.color, options.exclude) >= BACKGROUND_DISTANCE);
  const kept = ranked.reduce((sum, item) => sum + item.n, 0) || 1;
  ranked.forEach((item) => (item.weight = item.n / kept));

  const picked: WeightedColor[] = [];
  for (const candidate of ranked) {
    const near = picked.find((item) => colorDistance(item.color, candidate.color) < 0.12);
    if (near) near.weight += candidate.weight;
    else if (picked.length < count) picked.push({ color: candidate.color, weight: candidate.weight });
  }
  // A logo on white is mostly white; make sure the colorful part is represented.
  const vivid = ranked.find(
    (item) => item.color.c > 0.08 && !picked.some((p) => colorDistance(p.color, item.color) < 0.12),
  );
  if (vivid && !picked.some((item) => item.color.c > 0.08)) {
    picked[picked.length - 1] = { color: vivid.color, weight: vivid.weight };
  }
  return picked.sort((a, b) => b.weight - a.weight);
}

export const hexOf = (color: Oklch) => toHex({ ...color, alpha: 1 });
