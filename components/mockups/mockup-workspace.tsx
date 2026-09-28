"use client";

import { useMemo } from "react";

import { SvgPreviewCanvas } from "@/components/canvas/svg-preview-canvas";
import { StudioLayout } from "@/components/layout/studio-layout";
import { MockupContentPanel } from "@/components/mockups/mockup-content-panel";
import { MockupExportPanel } from "@/components/mockups/mockup-export-panel";
import { MockupPicker } from "@/components/mockups/mockup-picker";
import { Panel } from "@/components/ui/panel";
import { useMockupContext } from "@/hooks/use-mockup-context";
import { getTemplate, mockupTemplates } from "@/lib/mockups/registry";
import { signatureHtml } from "@/lib/mockups/signature";
import { useMockupStore } from "@/store/mockup-store";

export function MockupWorkspace() {
  const ctx = useMockupContext();
  const templateId = useMockupStore((state) => state.template);
  const template = getTemplate(templateId) ?? mockupTemplates[0];
  const svg = useMemo(() => (template ? template.render(ctx) : ""), [template, ctx]);

  return (
    <StudioLayout
      id="mockups"
      controls={
        <>
          <Panel title="Template">
            <MockupPicker />
          </Panel>
          <MockupContentPanel />
        </>
      }
      preview={
        svg ? (
          <SvgPreviewCanvas svg={svg} label={`${template?.label} mockup`} defaultBackdrop="checker" />
        ) : (
          <div className="flex min-h-80 flex-1 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
            Pick a template.
          </div>
        )
      }
      output={
        <MockupExportPanel
          svg={svg}
          name={ctx.brand.name}
          label={template?.label ?? "mockup"}
          signature={template?.id === "email-signature" ? signatureHtml(ctx) : undefined}
        />
      }
    />
  );
}
