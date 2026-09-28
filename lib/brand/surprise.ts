import { oklch } from "@/lib/color/color";
import { harmonyPalette } from "@/lib/color/harmony";
import { shadowPresets } from "@/lib/effects/shadow";
import { captureSnapshot, type BrandSnapshot } from "@/lib/projects/snapshot";
import { curatedPairs } from "@/lib/typography/pairing";
import { useBrandStore } from "@/store/brand-store";
import { useColorStore } from "@/store/color-store";
import { useEffectsStore } from "@/store/effects-store";
import { useTokensStore } from "@/store/tokens-store";
import { useTypographyStore } from "@/store/typography-store";
import type { HarmonyMode, Oklch } from "@/types/color";

const MODES: HarmonyMode[] = ["analogous", "complementary", "split-complementary", "triadic"];
const RADII = [0, 4, 8, 12, 16, 20, 24];
const SHADOWS = ["subtle", "smooth", "elevated", "card", "material", "floating"];

const pick = <T>(items: readonly T[], random: () => number): T => items[Math.floor(random() * items.length)]!;

/**
 * A pleasant palette: harmonious colors from one vivid base hue, with the last slot turned
 * into a deep neutral so the result is never all-bright or all-gray.
 */
export function surprisePalette(count: number, random: () => number = Math.random): Oklch[] {
  const base = oklch(0.56 + random() * 0.14, 0.15 + random() * 0.07, random() * 360);
  const colors = harmonyPalette(pick(MODES, random), base, count, random);
  if (count >= 3) colors[count - 1] = oklch(0.2 + random() * 0.06, 0.02 + random() * 0.02, base.h);
  return colors;
}

/**
 * A fresh direction for the brand in one step: palette (locked swatches stay), a curated font
 * pairing, a radius and a shadow. Name, description, logo and voice are left alone.
 * Returns the previous state so the caller can undo.
 */
export function surpriseBrand(random: () => number = Math.random): BrandSnapshot {
  const before = captureSnapshot();
  const count = useColorStore.getState().swatches.length;
  useColorStore.getState().generate(surprisePalette(count, random));
  // Let the new palette's roles be inferred again (the most colorful color leads).
  useBrandStore.getState().updateProfile({ roles: {} });
  const pair = pick(curatedPairs, random);
  useTypographyStore.getState().setPair({ heading: pair.heading, body: pair.body });
  useTokensStore.getState().update({ radiusBase: pick(RADII, random) });
  const shadow = shadowPresets.find((preset) => preset.id === pick(SHADOWS, random));
  if (shadow) useEffectsStore.getState().update("shadow", { layers: shadow.layers() });
  return before;
}
