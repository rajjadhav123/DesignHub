import { describe, expect, test } from "vitest";

import { fromHex } from "@/lib/color/color";
import { toFlutterTheme, toSwiftUITheme, toTokensStudio } from "@/lib/tokens/native";
import type { DesignTokens } from "@/types/tokens";

const shade = (step: number, hex: string) => ({ step, value: fromHex(hex) });

/** Two palette names that used to collide: "indigo" shade 250 and "indigo-2" shade 50. */
const tokens: DesignTokens = {
  meta: { name: "Acme Labs", prefix: "", generatedAt: "2026-01-01", colorFormat: "hex" },
  colors: [
    { name: "indigo", value: fromHex("#0f172a"), shades: [shade(50, "#f3f7fe"), shade(250, "#cdd9f3")] },
    { name: "indigo-2", value: fromHex("#6366f1"), shades: [shade(50, "#f1f6ff")] },
  ],
  semantic: [{ name: "primary", ref: "indigo-2", value: fromHex("#6366f1") }],
  gradient: null,
  typography: null,
  effects: [],
  spacing: [
    { name: "0.5", px: 2 },
    { name: "4", px: 16 },
  ],
  radius: [
    { name: "lg", px: 12 },
    { name: "full", px: 9999 },
  ],
};

const identifiers = (code: string, pattern: RegExp) => [...code.matchAll(pattern)].map((match) => match[1]);

describe("native formats", () => {
  test("Flutter identifiers are unique and valid", () => {
    const code = toFlutterTheme(tokens);
    const ids = identifiers(code, /static const (?:double )?([A-Za-z_][A-Za-z0-9_]*) =/g);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual(expect.arrayContaining(["indigo_250", "indigo2_50", "s0_5", "s4", "full"]));
    expect(code).toContain("class AcmeLabsColors");
    expect(code).toContain("Color(0xFF6366F1)");
  });

  test("SwiftUI colors are unique and brand-prefixed", () => {
    const code = toSwiftUITheme(tokens);
    const ids = identifiers(code, /static let ([A-Za-z_][A-Za-z0-9_]*)/g);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual(expect.arrayContaining(["acmeLabsIndigo_250", "acmeLabsIndigo2_50", "acmeLabsPrimary"]));
    expect(code).not.toMatch(/static let indigo\b/);
  });

  test("Tokens Studio resolves semantic aliases into the palette", () => {
    const json = JSON.parse(toTokensStudio(tokens));
    expect(json.global.color["indigo-2"]["50"]).toEqual({ value: "#f1f6ff", type: "color" });
    expect(json.global.semantic.primary.value).toBe("{color.indigo-2.base}");
    expect(json.global.spacing["0_5"]).toEqual({ value: "2", type: "spacing" });
    expect(json.$metadata.tokenSetOrder).toEqual(["global"]);
  });
});
