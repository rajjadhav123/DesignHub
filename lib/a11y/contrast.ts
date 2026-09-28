import { apcaContrast, contrastRatio, oklch, parseColor, toHex } from "@/lib/color/color";
import { formatRatio, suggestForeground } from "@/lib/color/contrast";
import type { A11yColors } from "@/types/a11y";

export type ContrastPair = {
  id: "body" | "link" | "button" | "component";
  label: string;
  /** Which color the fix would change. */
  fixes: keyof A11yColors;
  foreground: string;
  background: string;
  ratio: number;
  ratioLabel: string;
  /** WCAG 2.1 minimum for this use: 4.5 for text, 3 for UI components. */
  required: number;
  aa: boolean;
  aaLarge: boolean;
  aaa: boolean;
  aaaLarge: boolean;
  suggestion: string | null;
  /** APCA lightness contrast (Lc, signed). A draft method for WCAG 3, shown alongside WCAG 2. */
  apca: number;
  /** Minimum |Lc| for this use, from the APCA bronze-level guidance. */
  apcaTarget: number;
};

/**
 * APCA bronze-level minimums (https://readtech.org/ARC/tests/bronze-simple-mode/):
 * Lc 75 for body text, 60 for other content text such as bold labels, 45 for large headlines,
 * and 30 for non-text elements like borders and icons.
 */
export const APCA_TARGETS = { body: 75, content: 60, headline: 45, nonText: 30 } as const;

const fallback = oklch(0, 0, 0);

function pair(
  id: ContrastPair["id"],
  label: string,
  foreground: string,
  background: string,
  fixes: keyof A11yColors,
  required: number,
  apcaTarget: number,
): ContrastPair {
  const fg = parseColor(foreground) ?? fallback;
  const bg = parseColor(background) ?? fallback;
  const ratio = contrastRatio(fg, bg);
  const suggestion = suggestForeground(fg, bg, required);
  return {
    id,
    label,
    fixes,
    foreground,
    background,
    ratio,
    ratioLabel: formatRatio(ratio),
    required,
    aa: ratio >= 4.5,
    aaLarge: ratio >= 3,
    aaa: ratio >= 7,
    aaaLarge: ratio >= 4.5,
    suggestion: suggestion ? toHex(suggestion) : null,
    apca: apcaContrast(fg, bg),
    apcaTarget,
  };
}

/** The pairs a real interface actually has, not just "text on background". */
export function contrastPairs(colors: A11yColors): ContrastPair[] {
  return [
    pair("body", "Body text", colors.text, colors.background, "text", 4.5, APCA_TARGETS.body),
    pair("link", "Links", colors.accent, colors.background, "accent", 4.5, APCA_TARGETS.body),
    // Button labels are short and usually semibold, so APCA's content-text level applies.
    pair("button", "Button label", colors.onAccent, colors.accent, "onAccent", 4.5, APCA_TARGETS.content),
    // WCAG 1.4.11: a button's shape must stand out from the page by 3:1.
    pair(
      "component",
      "Button vs page (UI, 1.4.11)",
      colors.accent,
      colors.background,
      "accent",
      3,
      APCA_TARGETS.nonText,
    ),
  ];
}

export function contrastSection(colors: A11yColors) {
  return contrastPairs(colors).map((item) => ({
    check: item.label,
    foreground: item.foreground,
    background: item.background,
    ratio: Math.floor(item.ratio * 100) / 100,
    required: item.required,
    pass: item.ratio >= item.required,
    wcag: { AA: item.aa, "AA large": item.aaLarge, AAA: item.aaa, "AAA large": item.aaaLarge },
    suggestion: item.suggestion,
    apca: {
      lc: Math.round(item.apca * 10) / 10,
      target: item.apcaTarget,
      pass: Math.abs(item.apca) >= item.apcaTarget,
      note: "APCA is a draft method for WCAG 3. Lc is positive for dark on light, negative for light on dark.",
    },
  }));
}
