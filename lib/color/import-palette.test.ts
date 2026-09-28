import { expect, test } from "vitest";

import { toHex } from "@/lib/color/color";
import { parsePaletteImport } from "@/lib/color/import-palette";

test("parses a Coolors palette URL", () => {
  const result = parsePaletteImport("https://coolors.co/264653-2a9d8f-e9c46a-f4a261-e76f51");

  expect(result.colors.map(toHex)).toEqual(["#264653", "#2a9d8f", "#e9c46a", "#f4a261", "#e76f51"]);
  expect(result.dropped).toBe(0);
});

test("parses the Coolors palette URL format", () => {
  const result = parsePaletteImport("https://coolors.co/palette/264653-2a9d8f-e9c46a");

  expect(result.colors.map(toHex)).toEqual(["#264653", "#2a9d8f", "#e9c46a"]);
  expect(result.dropped).toBe(0);
});

test("parses hex codes from surrounding text", () => {
  const result = parsePaletteImport("Primary: #264653, accent #2a9d8f and highlight #e9c46a.");

  expect(result.colors.map(toHex)).toEqual(["#264653", "#2a9d8f", "#e9c46a"]);
});

test("accepts three digit hex codes", () => {
  const result = parsePaletteImport("#abc, #def");

  expect(result.colors.map(toHex)).toEqual(["#aabbcc", "#ddeeff"]);
});

test("drops colors after the maximum", () => {
  const result = parsePaletteImport(
    "#000000 #111111 #222222 #333333 #444444 #555555 #666666 #777777 #888888 #999999 #aaaaaa",
  );

  expect(result.colors.length).toBe(10);
  expect(result.dropped).toBe(1);
});

test("returns no colors when the input has no hex codes", () => {
  const result = parsePaletteImport("not a palette");

  expect(result.colors).toEqual([]);
  expect(result.dropped).toBe(0);
});
