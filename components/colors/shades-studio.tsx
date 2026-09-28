"use client";

import { useMemo } from "react";

import { ShadeRamp } from "@/components/colors/shade-ramp";
import { SliderField } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Panel } from "@/components/ui/panel";
import { Switch } from "@/components/ui/switch";
import { useRovingRadio } from "@/hooks/use-roving-radio";
import { toHex } from "@/lib/color/color";
import { paletteNames } from "@/lib/color/names";
import { generateShades, nearestStep } from "@/lib/color/shades";
import { cn } from "@/lib/utils";
import { useColorStore, useSelectedSwatch } from "@/store/color-store";

export function ShadesStudio() {
  const radiosRef = useRovingRadio<HTMLDivElement>();
  const swatches = useColorStore((state) => state.swatches);
  const select = useColorStore((state) => state.select);
  const options = useColorStore((state) => state.shadeOptions);
  const setOptions = useColorStore((state) => state.setShadeOptions);
  const selected = useSelectedSwatch();
  const names = useMemo(() => paletteNames(swatches.map((swatch) => swatch.color)), [swatches]);

  const ramps = useMemo(
    () => swatches.map((swatch) => ({ swatch, shades: generateShades(swatch.color, options) })),
    [swatches, options],
  );
  const selectedIndex = swatches.findIndex((swatch) => swatch.id === selected?.id);
  const active = ramps[selectedIndex];

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="flex min-w-0 flex-col gap-8">
        {active && selected ? (
          <section aria-label="Selected shades" className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="text-lg font-medium capitalize">{names[selectedIndex]}</h2>
              <p className="text-xs text-subtle-foreground">
                Base sits at {nearestStep(selected.color)} · click any shade to copy
              </p>
            </div>
            <ShadeRamp
              name={names[selectedIndex] ?? "color"}
              shades={active.shades}
              anchorStep={options.anchor ? nearestStep(selected.color) : undefined}
            />
          </section>
        ) : null}
        <section aria-label="All palette shades" className="flex flex-col gap-3">
          <h2 className="text-sm font-medium">Full scale</h2>
          <div className="grid grid-cols-[72px_minmax(0,1fr)] items-center gap-x-4 gap-y-2">
            <span />
            <div className="grid grid-cols-11 text-center font-mono text-[10px] text-subtle-foreground">
              {active?.shades.map((shade) => (
                <span key={shade.step}>{shade.step}</span>
              ))}
            </div>
            {ramps.map(({ swatch, shades }, index) => (
              <div key={swatch.id} className="contents">
                <span className="truncate text-xs text-muted-foreground capitalize">{names[index]}</span>
                <ShadeRamp name={names[index] ?? "color"} shades={shades} size="sm" />
              </div>
            ))}
          </div>
        </section>
      </div>

      <Panel title="Shade options">
        <div className="flex flex-col gap-2">
          <Label>Base color</Label>
          <div ref={radiosRef} className="flex flex-wrap gap-2" role="radiogroup" aria-label="Base color">
            {swatches.map((swatch, index) => (
              <button
                key={swatch.id}
                type="button"
                role="radio"
                aria-checked={swatch.id === selected?.id}
                aria-label={names[index]}
                onClick={() => select(swatch.id)}
                className={cn(
                  "size-8 rounded-md border ring-offset-2 ring-offset-card transition-shadow duration-150",
                  swatch.id === selected?.id && "ring-2 ring-foreground",
                )}
                style={{ background: toHex(swatch.color) }}
              />
            ))}
          </div>
        </div>
        <SliderField
          label="Hue shift"
          value={options.hueShift}
          min={-40}
          max={40}
          onChange={(hueShift) => setOptions({ hueShift })}
          format={(value) => `${value}°`}
        />
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="shade-anchor">Keep exact base color</Label>
          <Switch id="shade-anchor" checked={options.anchor} onCheckedChange={(anchor) => setOptions({ anchor })} />
        </div>
        <p className="text-xs text-subtle-foreground">
          Shades are computed in OKLCH so every step is evenly spaced to the eye. Hue shift rotates light tints and dark
          shades in opposite directions for richer ramps.
        </p>
      </Panel>
    </div>
  );
}
