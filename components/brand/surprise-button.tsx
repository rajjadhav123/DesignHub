"use client";

import { Shuffle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { surpriseBrand } from "@/lib/brand/surprise";
import { applySnapshot } from "@/lib/projects/snapshot";

/** One click for a new palette, font pairing, radius and shadow, with undo. */
export function SurpriseButton() {
  function surprise() {
    const before = surpriseBrand();
    toast.success("New direction applied", {
      description: "Palette, fonts, radius and shadow changed. Locked colors stayed.",
      action: { label: "Undo", onClick: () => applySnapshot(before) },
    });
  }

  return (
    <Button variant="outline" className="w-full" onClick={surprise}>
      <Shuffle /> Surprise me
    </Button>
  );
}
