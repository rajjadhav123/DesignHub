"use client";

import { Check, ImageUp, Loader2, RotateCcw, Sparkles, TriangleAlert } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { DnaResultEditor } from "@/components/brand-dna/dna-result-editor";
import { StudioLayout } from "@/components/layout/studio-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Panel } from "@/components/ui/panel";
import { Switch } from "@/components/ui/switch";
import { isTypingTarget } from "@/hooks/use-hotkeys";
import { applyBrandDna } from "@/lib/brand-dna/apply";
import { ACCEPTED_IMAGES, loadDnaImage } from "@/lib/brand-dna/image";
import { dnaProviders, getDnaProvider } from "@/lib/brand-dna/registry";
import { dnaStages, type BrandDna, type DnaImage, type DnaStage } from "@/lib/brand-dna/types";
import { applySnapshot } from "@/lib/projects/snapshot";
import { cn } from "@/lib/utils";
import { useBrandDnaStore } from "@/store/brand-dna-store";

type Status = { kind: "idle" } | { kind: "running"; stage: DnaStage } | { kind: "error"; message: string };

export function BrandDnaWorkspace() {
  const providerId = useBrandDnaStore((state) => state.providerId);
  const setProvider = useBrandDnaStore((state) => state.setProvider);
  const ignoreBackground = useBrandDnaStore((state) => state.ignoreBackground);
  const setIgnoreBackground = useBrandDnaStore((state) => state.setIgnoreBackground);
  const provider = getDnaProvider(providerId);
  const [image, setImage] = useState<DnaImage | null>(null);
  const [dna, setDna] = useState<BrandDna | null>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(
    () => () => {
      abortRef.current?.abort();
    },
    [],
  );
  useEffect(
    () => () => {
      if (image) URL.revokeObjectURL(image.url);
    },
    [image],
  );

  async function analyze(target: DnaImage, providerKey = providerId, ignore = ignoreBackground) {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setDna(null);
    setStatus({ kind: "running", stage: "reading" });
    try {
      const result = await getDnaProvider(providerKey).analyze(target, {
        signal: controller.signal,
        onStage: (stage) => setStatus({ kind: "running", stage }),
        ignoreBackground: ignore,
      });
      if (controller.signal.aborted) return;
      setDna(result);
      setStatus({ kind: "idle" });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setStatus({ kind: "error", message: error instanceof Error ? error.message : "Analysis failed." });
    }
  }

  async function upload(file: File | undefined) {
    if (!file) return;
    try {
      const next = await loadDnaImage(file);
      setImage(next);
      void analyze(next);
    } catch (error) {
      setStatus({ kind: "error", message: error instanceof Error ? error.message : "Could not read that image." });
    }
  }

  // Paste an image from the clipboard anywhere on the page (except while typing in a field).
  const uploadRef = useRef(upload);
  uploadRef.current = upload;
  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      if (isTypingTarget(event.target)) return;
      const file =
        [...(event.clipboardData?.files ?? [])].find((item) => item.type.startsWith("image/")) ??
        [...(event.clipboardData?.items ?? [])]
          .find((item) => item.kind === "file" && item.type.startsWith("image/"))
          ?.getAsFile();
      if (!file) return;
      event.preventDefault();
      void uploadRef.current(file);
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, []);

  function apply() {
    if (!dna) return;
    const before = applyBrandDna(dna);
    toast.success("Brand DNA applied", {
      description: "Palette, fonts, radius and personality were updated.",
      action: { label: "Undo", onClick: () => applySnapshot(before) },
    });
  }

  const running = status.kind === "running";
  const stageIndex = running ? dnaStages.findIndex((stage) => stage.id === status.stage) : -1;

  return (
    <StudioLayout
      id="brand-dna"
      controls={
        <>
          <Panel title="Source image" description="A logo, product shot or moodboard. It never leaves your device.">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setDragging(false);
                void upload(event.dataTransfer.files[0]);
              }}
              className={cn(
                "flex min-h-32 flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-4 text-sm text-muted-foreground transition-colors duration-150 hover:border-border-strong hover:text-foreground",
                dragging && "border-brand bg-brand/5 text-foreground",
              )}
            >
              <ImageUp className="size-5" />
              <span>{image ? "Replace image" : "Drop, paste or click to upload"}</span>
              <span className="text-[11px] text-subtle-foreground">PNG, JPEG, WebP, GIF, AVIF or SVG, up to 10 MB</span>
            </button>
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPTED_IMAGES.join(",")}
              className="sr-only"
              tabIndex={-1}
              aria-label="Source image"
              onChange={(event) => {
                void upload(event.target.files?.[0]);
                event.target.value = "";
              }}
            />
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="dna-ignore-background" className="flex flex-col items-start gap-0.5">
                Ignore background
                <span className="text-[11px] font-normal text-subtle-foreground">
                  Leaves a flat backdrop, like the white behind a logo, out of the palette.
                </span>
              </Label>
              <Switch
                id="dna-ignore-background"
                checked={ignoreBackground}
                onCheckedChange={(value) => {
                  setIgnoreBackground(value);
                  if (image) void analyze(image, providerId, value);
                }}
              />
            </div>
          </Panel>
          <Panel title="Provider">
            <div role="radiogroup" aria-label="Analysis provider" className="flex flex-col gap-1.5">
              {dnaProviders.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="radio"
                  aria-checked={item.id === provider.id}
                  onClick={() => {
                    setProvider(item.id);
                    if (image) void analyze(image, item.id);
                  }}
                  className={cn(
                    "flex flex-col gap-1 rounded-md border p-2.5 text-left transition-colors duration-150 hover:border-border-strong",
                    item.id === provider.id && "border-brand/60 bg-surface-raised",
                  )}
                >
                  <span className="flex items-center gap-2 text-sm font-medium">
                    {item.label}
                    {item.local ? <Badge variant="success">Private</Badge> : null}
                    {item.mocked ? <Badge variant="warning">Sample data</Badge> : null}
                  </span>
                  <span className="text-xs text-muted-foreground">{item.description}</span>
                </button>
              ))}
            </div>
          </Panel>
        </>
      }
      preview={
        <div className="flex min-h-80 flex-1 flex-col gap-4 rounded-lg border bg-surface-raised p-4">
          {image ? (
            <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-md bg-checker">
              {/* eslint-disable-next-line @next/next/no-img-element -- local object URL */}
              <img src={image.url} alt={`Uploaded ${image.name}`} className="max-h-full max-w-full object-contain" />
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
              <Sparkles className="size-6 text-brand" />
              <p className="max-w-sm">
                Upload an image to extract its colors, mood and a matching type pairing, then apply them to your brand.
              </p>
            </div>
          )}
          {running ? (
            <ol aria-live="polite" aria-label="Analysis progress" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {dnaStages.map((stage, i) => (
                <li
                  key={stage.id}
                  className={cn(
                    "flex items-center gap-2 rounded-md border px-2.5 py-2 text-xs text-muted-foreground",
                    i === stageIndex && "border-brand/60 text-foreground",
                  )}
                >
                  {i < stageIndex ? (
                    <Check className="size-3.5 text-success" />
                  ) : i === stageIndex ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <span className="size-3.5 rounded-full border" />
                  )}
                  {stage.label}
                </li>
              ))}
            </ol>
          ) : null}
          {dna ? (
            <div className="flex flex-col gap-2">
              <div className="flex h-12 overflow-hidden rounded-md border" aria-label="Extracted palette" role="img">
                {dna.colors.map((color, i) => (
                  <span key={i} style={{ background: color.hex, flexGrow: Math.max(0.08, color.weight) }} />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {dna.mood} · {Math.round(dna.confidence * 100)}% confidence · {dna.notes.join(" ")}
              </p>
            </div>
          ) : null}
          {status.kind === "error" ? (
            <p role="alert" className="flex items-center gap-2 text-sm text-destructive">
              <TriangleAlert className="size-4" /> {status.message}
            </p>
          ) : null}
        </div>
      }
      output={
        <>
          <h2 className="text-sm font-medium">Brand DNA</h2>
          {dna ? (
            <>
              <DnaResultEditor dna={dna} onChange={setDna} />
              <div className="flex gap-2">
                <Button className="flex-1" onClick={apply}>
                  <Sparkles /> Apply to brand
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Analyze again"
                  onClick={() => image && void analyze(image)}
                  disabled={!image || running}
                >
                  <RotateCcw />
                </Button>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              {running ? "Analyzing..." : "Results appear here, ready to edit before you apply them."}
            </p>
          )}
        </>
      }
    />
  );
}
