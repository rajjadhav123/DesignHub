import { describe, expect, test } from "vitest";

import { detectBackground, extractPalette, hexOf } from "@/lib/brand-dna/palette";

const SIZE = 40;

/** A SIZE x SIZE RGBA image from a function of (x, y). */
function image(paint: (x: number, y: number) => [number, number, number, number?]): Uint8ClampedArray {
  const pixels = new Uint8ClampedArray(SIZE * SIZE * 4);
  for (let y = 0; y < SIZE; y += 1) {
    for (let x = 0; x < SIZE; x += 1) {
      const [r, g, b, a = 255] = paint(x, y);
      pixels.set([r, g, b, a], (y * SIZE + x) * 4);
    }
  }
  return pixels;
}

/** A red and blue logo mark in the middle of a white canvas. */
const logoOnWhite = image((x, y) => {
  const inMark = x >= 12 && x < 28 && y >= 12 && y < 28;
  if (!inMark) return [255, 255, 255];
  return y < 20 ? [229, 57, 53] : [30, 64, 175];
});

/** A full-bleed horizontal gradient: no flat background anywhere. */
const gradient = image((x) => [Math.round((x / SIZE) * 255), 80, 200]);

describe("detectBackground", () => {
  test("finds the white behind a logo", () => {
    const background = detectBackground(logoOnWhite, SIZE, SIZE);
    expect(background && hexOf(background)).toBe("#ffffff");
  });

  test("returns null for a full-bleed image", () => {
    expect(detectBackground(gradient, SIZE, SIZE)).toBeNull();
  });

  test("ignores transparent pixels", () => {
    expect(
      detectBackground(
        image(() => [0, 0, 0, 0]),
        SIZE,
        SIZE,
      ),
    ).toBeNull();
  });
});

describe("extractPalette", () => {
  test("without exclusion, white dominates a logo on white", () => {
    const palette = extractPalette(logoOnWhite, 5);
    expect(hexOf(palette[0]!.color)).toBe("#ffffff");
  });

  test("excluding the background leaves the logo colors, weighted as the whole image", () => {
    const background = detectBackground(logoOnWhite, SIZE, SIZE);
    const palette = extractPalette(logoOnWhite, 5, { exclude: background });
    const hexes = palette.map((item) => hexOf(item.color));
    expect(hexes).not.toContain("#ffffff");
    expect(hexes).toEqual(expect.arrayContaining(["#e53935", "#1e40af"]));
    const total = palette.reduce((sum, item) => sum + item.weight, 0);
    expect(total).toBeCloseTo(1, 5);
  });
});
