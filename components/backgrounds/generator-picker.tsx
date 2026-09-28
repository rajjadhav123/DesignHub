"use client";

import { useRovingRadio } from "@/hooks/use-roving-radio";
import { backgroundGenerators } from "@/lib/background/registry";
import { cn } from "@/lib/utils";
import { useBackgroundStore } from "@/store/background-store";

export function GeneratorPicker() {
  const radiosRef = useRovingRadio<HTMLDivElement>();
  const kind = useBackgroundStore((state) => state.settings.kind);
  const setKind = useBackgroundStore((state) => state.setKind);

  if (backgroundGenerators.length === 0) {
    return <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">No generators yet.</p>;
  }

  return (
    <div ref={radiosRef} role="radiogroup" aria-label="Generator" className="grid grid-cols-2 gap-1.5">
      {backgroundGenerators.map((generator) => (
        <button
          key={generator.kind}
          type="button"
          role="radio"
          aria-checked={generator.kind === kind}
          onClick={() => setKind(generator.kind, generator)}
          title={generator.description}
          className={cn(
            "flex h-9 min-w-0 items-center truncate rounded-md border px-2.5 text-left text-sm text-muted-foreground transition-colors duration-150 hover:border-border-strong hover:text-foreground",
            generator.kind === kind && "border-brand/60 bg-surface-raised text-foreground",
          )}
        >
          {generator.label}
        </button>
      ))}
    </div>
  );
}
