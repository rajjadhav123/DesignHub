import { expect, test } from "vitest";

import { surprisePalette } from "@/lib/brand/surprise";

/** A seeded generator so the test is repeatable. */
function seeded(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

test.each([1, 2, 3, 42, 99])("seed %i gives a usable palette", (seed) => {
  const colors = surprisePalette(5, seeded(seed));
  expect(colors).toHaveLength(5);
  // At least two vivid colors and one deep neutral: never all-bright or all-gray.
  expect(colors.filter((color) => color.c >= 0.08).length).toBeGreaterThanOrEqual(2);
  expect(colors.some((color) => color.l < 0.3 && color.c < 0.05)).toBe(true);
});
