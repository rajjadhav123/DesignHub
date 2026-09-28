"use client";

import { useRovingRadio } from "@/hooks/use-roving-radio";
import { effectDefinitions } from "@/lib/effects/registry";
import { cn } from "@/lib/utils";
import { useEffectsStore } from "@/store/effects-store";

export function EffectPicker() {
  const radiosRef = useRovingRadio<HTMLDivElement>();
  const kind = useEffectsStore((state) => state.kind);
  const setKind = useEffectsStore((state) => state.setKind);

  if (effectDefinitions.length === 0) {
    return <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">No effects yet.</p>;
  }

  return (
    <div ref={radiosRef} role="radiogroup" aria-label="Effect" className="grid grid-cols-2 gap-1.5">
      {effectDefinitions.map((definition) => (
        <button
          key={definition.kind}
          type="button"
          role="radio"
          aria-checked={definition.kind === kind}
          onClick={() => setKind(definition.kind)}
          title={definition.description}
          className={cn(
            "flex h-9 min-w-0 items-center truncate rounded-md border px-2.5 text-left text-sm text-muted-foreground transition-colors duration-150 hover:border-border-strong hover:text-foreground",
            definition.kind === kind && "border-brand/60 bg-surface-raised text-foreground",
          )}
        >
          {definition.label}
        </button>
      ))}
    </div>
  );
}
