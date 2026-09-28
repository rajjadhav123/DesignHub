import { describe, expect, test } from "vitest";

import {
  colorDistance,
  contrastRatio,
  formatColor,
  fromHex,
  inGamut,
  oklch,
  parseColor,
  readableTextColor,
  toHex,
  toRgb,
} from "@/lib/color/color";
import { ratingLabel, suggestForeground } from "@/lib/color/contrast";

describe("parseColor", () => {
  test.each([
    ["#6366f1", "#6366f1"],
    ["#fff", "#ffffff"],
    ["rgb(99 102 241)", "#6366f1"],
    ["rgb(255, 0, 0)", "#ff0000"],
    ["hsl(0 100% 50%)", "#ff0000"],
    ["oklch(0.62 0.2 277)", toHex(oklch(0.62, 0.2, 277))],
    ["rebeccapurple", "#663399"],
  ])("reads %s", (input, hex) => {
    const color = parseColor(input);
    expect(color).not.toBeNull();
    expect(toHex(color!)).toBe(hex);
  });

  test.each(["", "not a color", "#12", "rgb(nope)"])("returns null for %j", (input) => {
    expect(parseColor(input)).toBeNull();
  });
});

describe("hex round trips", () => {
  test.each(["#000000", "#ffffff", "#6366f1", "#f472b6", "#0f172a", "#34d399", "#fbbf24"])("%s", (hex) => {
    expect(toHex(fromHex(hex))).toBe(hex);
  });

  test("keeps alpha as an 8-digit hex", () => {
    expect(toHex(oklch(0, 0, 0, 0.5))).toBe("#00000080");
  });

  test("fromHex falls back to black for bad input", () => {
    expect(toHex(fromHex("nope"))).toBe("#000000");
  });
});

describe("contrast", () => {
  const black = fromHex("#000000");
  const white = fromHex("#ffffff");

  test("black on white is 21:1", () => {
    expect(contrastRatio(black, white)).toBeCloseTo(21, 1);
  });

  test("a color against itself is 1:1", () => {
    expect(contrastRatio(fromHex("#6366f1"), fromHex("#6366f1"))).toBeCloseTo(1, 5);
  });

  test("is symmetric", () => {
    const a = fromHex("#6366f1");
    const b = fromHex("#f8fafc");
    expect(contrastRatio(a, b)).toBeCloseTo(contrastRatio(b, a), 5);
  });

  test("readableTextColor picks the stronger of black and white", () => {
    expect(toHex(readableTextColor(fromHex("#0f172a")))).toBe("#ffffff");
    expect(toHex(readableTextColor(fromHex("#fbbf24")))).toBe("#000000");
  });

  test("ratingLabel follows WCAG thresholds", () => {
    expect(ratingLabel(7.1)).toBe("AAA");
    expect(ratingLabel(4.6)).toBe("AA");
    expect(ratingLabel(3.2)).toBe("AA Large");
    expect(ratingLabel(2)).toBe("Fail");
  });

  test("suggestForeground reaches the target ratio", () => {
    const bg = fromHex("#ffffff");
    const suggestion = suggestForeground(fromHex("#a5b4fc"), bg, 4.5);
    expect(suggestion).not.toBeNull();
    expect(contrastRatio(suggestion!, bg)).toBeGreaterThanOrEqual(4.5);
  });
});

describe("conversions", () => {
  test("toRgb returns 0-255 channels", () => {
    expect(toRgb(fromHex("#6366f1"))).toMatchObject({ r: 99, g: 102, b: 241 });
  });

  test("formatColor writes every notation", () => {
    const color = fromHex("#ff0000");
    expect(formatColor(color, "hex")).toBe("#ff0000");
    expect(formatColor(color, "rgb")).toMatch(/^rgb\(255 0 0/);
    expect(formatColor(color, "hsl")).toMatch(/^hsl\(/);
    expect(formatColor(color, "oklch")).toMatch(/^oklch\(/);
  });

  test("oklch clamps out-of-range input", () => {
    const color = oklch(2, 1, -30, 3);
    expect(color).toEqual({ l: 1, c: 0.4, h: 330, alpha: 1 });
  });

  test("gamut checks", () => {
    expect(inGamut(fromHex("#6366f1"))).toBe(true);
    expect(inGamut(oklch(0.7, 0.35, 150), "srgb")).toBe(false);
  });

  test("colorDistance is zero for equal colors and grows with difference", () => {
    const a = fromHex("#6366f1");
    expect(colorDistance(a, a)).toBe(0);
    expect(colorDistance(a, fromHex("#ffffff"))).toBeGreaterThan(colorDistance(a, fromHex("#6d70f5")));
  });
});
