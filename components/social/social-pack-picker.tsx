"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { socialPlatforms, socialTemplates } from "@/lib/social/registry";
import { cn } from "@/lib/utils";
import { useSocialStore } from "@/store/social-store";

/** Checkboxes for the templates that go into the ZIP pack, grouped by platform. */
export function SocialPackPicker() {
  const selection = useSocialStore((state) => state.packSelection);
  const setSelection = useSocialStore((state) => state.setPackSelection);
  const [open, setOpen] = useState(false);
  const chosen = new Set(selection ?? socialTemplates.map((template) => template.id));

  const toggle = (ids: string[], on: boolean) => {
    const next = new Set(chosen);
    ids.forEach((id) => (on ? next.add(id) : next.delete(id)));
    // Everything selected is stored as "all", so templates added later are included too.
    setSelection(
      next.size === socialTemplates.length ? null : socialTemplates.map((t) => t.id).filter((id) => next.has(id)),
    );
  };

  return (
    <div className="flex flex-col gap-2 rounded-md border p-2.5">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="social-pack-list"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center justify-between gap-2 text-left text-xs font-medium"
      >
        <span>
          Choose assets{" "}
          <span className="font-normal text-muted-foreground">
            ({chosen.size} of {socialTemplates.length})
          </span>
        </span>
        <ChevronDown className={cn("size-3.5 transition-transform duration-150", !open && "-rotate-90")} aria-hidden />
      </button>
      {open ? (
        <div id="social-pack-list" className="flex flex-col gap-3">
          <div className="flex gap-1.5">
            <Button variant="outline" size="sm" className="h-7" onClick={() => setSelection(null)}>
              Select all
            </Button>
            <Button variant="outline" size="sm" className="h-7" onClick={() => setSelection([])}>
              None
            </Button>
          </div>
          {socialPlatforms
            .filter((platform) => socialTemplates.some((template) => template.platform === platform))
            .map((platform) => {
              const templates = socialTemplates.filter((template) => template.platform === platform);
              const ids = templates.map((template) => template.id);
              const all = ids.every((id) => chosen.has(id));
              return (
                <fieldset key={platform} className="flex flex-col gap-1">
                  <legend className="sr-only">{platform}</legend>
                  <label className="flex items-center gap-2 text-[11px] font-medium tracking-[0.12em] text-subtle-foreground uppercase">
                    <input
                      type="checkbox"
                      checked={all}
                      onChange={(event) => toggle(ids, event.target.checked)}
                      className="size-3.5 accent-[var(--color-brand)]"
                    />
                    {platform}
                  </label>
                  <div className="grid gap-1 pl-5 sm:grid-cols-2">
                    {templates.map((template) => (
                      <label
                        key={template.id}
                        className="flex min-h-6 items-center gap-2 text-xs text-muted-foreground"
                      >
                        <input
                          type="checkbox"
                          checked={chosen.has(template.id)}
                          onChange={(event) => toggle([template.id], event.target.checked)}
                          className="size-3.5 shrink-0 accent-[var(--color-brand)]"
                        />
                        <span className="truncate">{template.style ?? template.label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              );
            })}
        </div>
      ) : null}
    </div>
  );
}
