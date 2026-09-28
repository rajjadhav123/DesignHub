"use client";

import { Check, Wand2, X } from "lucide-react";
import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { contrastPairs } from "@/lib/a11y/contrast";
import { cn } from "@/lib/utils";
import { useA11yStore } from "@/store/a11y-store";

export function ContrastResults() {
  const colors = useA11yStore((state) => state.colors);
  const setColors = useA11yStore((state) => state.setColors);
  const pairs = useMemo(() => contrastPairs(colors), [colors]);

  return (
    <Panel
      title="WCAG contrast"
      description="WCAG 2.1 · 1.4.3 (AA), 1.4.6 (AAA), 1.4.11 (non-text). APCA readouts are the WCAG 3 draft method and don't affect pass or fail."
    >
      <ul className="flex flex-col gap-2" aria-label="Contrast checks">
        {pairs.map((item) => {
          const pass = item.ratio >= item.required;
          return (
            <li
              key={item.id}
              className={cn(
                "flex flex-col gap-2 rounded-md border p-3",
                pass ? "border-success/30" : "border-destructive/40",
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className="flex size-8 shrink-0 items-center justify-center rounded-md border text-xs font-semibold"
                  style={{ background: item.background, color: item.foreground }}
                  aria-hidden
                >
                  Aa
                </span>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-medium">{item.label}</span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {item.ratioLabel} · needs {item.required}:1
                  </span>
                  <span
                    className="font-mono text-xs text-muted-foreground"
                    title="APCA (Accessible Perceptual Contrast Algorithm) is the draft method for WCAG 3. Lc is positive for dark text on a light background and negative for light on dark; the size of the number is what matters."
                  >
                    APCA Lc {item.apca.toFixed(1)} · needs {item.apcaTarget}
                  </span>
                </div>
                {pass ? (
                  <Check className="size-4 text-success" aria-label="Pass" />
                ) : (
                  <X className="size-4 text-destructive" aria-label="Fail" />
                )}
              </div>
              <div className="flex flex-wrap gap-1">
                {item.required === 4.5
                  ? (
                      [
                        ["AA", item.aa],
                        ["AA large", item.aaLarge],
                        ["AAA", item.aaa],
                        ["AAA large", item.aaaLarge],
                      ] as const
                    ).map(([label, ok]) => (
                      <Badge key={label} variant={ok ? "success" : "destructive"}>
                        {label}
                      </Badge>
                    ))
                  : null}
                {/* Advisory only: APCA is a draft, so it never changes the WCAG 2 verdict. */}
                <Badge variant={Math.abs(item.apca) >= item.apcaTarget ? "success" : "warning"}>
                  {Math.abs(item.apca) >= item.apcaTarget ? "APCA ok" : "APCA low"}
                </Badge>
              </div>
              {!pass && item.suggestion ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="self-start"
                  onClick={() => setColors({ [item.fixes]: item.suggestion })}
                >
                  <Wand2 /> Use {item.suggestion}
                </Button>
              ) : null}
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}
