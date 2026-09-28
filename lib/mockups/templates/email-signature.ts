import { lines, logo, mockupDoc, text } from "@/lib/mockups/kit";
import { screen, studio } from "@/lib/mockups/templates/devices";
import type { MockupContext, MockupTemplate } from "@/lib/mockups/types";

const SW = 1400;
const SH = 880;

function mailWindow(ctx: MockupContext): string {
  const { surface, content, brand } = ctx;
  const pad = 64;
  const sigY = 520;
  return `<rect width="${SW}" height="${SH}" fill="${surface.background}"/>
    <rect width="${SW}" height="64" fill="${surface.surface}"/>
    <rect y="64" width="${SW}" height="1" fill="${surface.border}"/>
    <circle cx="32" cy="32" r="7" fill="#ff5f57"/><circle cx="56" cy="32" r="7" fill="#febc2e"/><circle cx="80" cy="32" r="7" fill="#28c840"/>
    ${text(SW / 2, 40, "Re: Next steps", { size: 18, fill: surface.muted, font: "bb", anchor: "middle" })}
    ${text(pad, 130, "Re: Next steps", { size: 34, fill: surface.text, font: "h" })}
    <circle cx="${pad + 22}" cy="186" r="22" fill="${surface.primary}"/>
    ${text(pad + 60, 180, content.person, { size: 18, fill: surface.text, font: "bb" })}
    ${text(pad + 60, 204, `to Alex Morgan  ·  ${content.email}`, { size: 15, fill: surface.muted })}
    ${text(pad, 280, "Hi Alex,", { size: 20, fill: surface.text })}
    ${lines(pad, 312, SW - pad * 2 - 200, 3, 34, surface.border)}
    ${lines(pad, 428, SW - pad * 2 - 360, 1, 34, surface.border)}
    ${text(pad, sigY - 16, "Best,", { size: 20, fill: surface.text })}
    <rect x="${pad}" y="${sigY + 16}" width="360" height="3" rx="1.5" fill="${surface.primary}"/>
    ${logo(ctx, { x: pad, y: sigY + 44, width: 60, height: 60 }, undefined, "sig-mark")}
    ${text(pad + 80, sigY + 70, content.person, { size: 24, fill: surface.text, font: "bb" })}
    ${text(pad + 80, sigY + 98, `${content.role}, ${brand.name}`, { size: 17, fill: surface.muted })}
    ${text(pad, sigY + 150, content.phone, { size: 17, fill: surface.text })}
    ${text(pad + 230, sigY + 150, content.website, { size: 17, fill: surface.primaryText, font: "bb" })}
    ${text(pad + 430, sigY + 150, content.email, { size: 17, fill: surface.muted })}
    ${text(pad, sigY + 186, content.address, { size: 15, fill: surface.muted })}`;
}

export const emailSignature: MockupTemplate = {
  id: "email-signature",
  label: "Email signature",
  category: "Screens",
  description: "A branded signature in a mail window. Copy it as HTML for Gmail or Outlook.",
  render(ctx) {
    const width = 1700;
    const height = 1100;
    const x = (width - SW) / 2;
    const y = (height - SH) / 2;
    const r = 16;
    return mockupDoc(
      ctx,
      width,
      height,
      `${studio(ctx, width, height)}
      <g filter="url(#soft)"><rect x="${x}" y="${y}" width="${SW}" height="${SH}" rx="${r}" fill="${ctx.surface.background}"/></g>
      <clipPath id="mail-clip"><rect x="${x}" y="${y}" width="${SW}" height="${SH}" rx="${r}"/></clipPath>
      <g clip-path="url(#mail-clip)">${screen(x, y, SW, SH, mailWindow(ctx))}</g>`,
    );
  },
};
