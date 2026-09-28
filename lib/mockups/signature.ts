import type { MockupContext } from "@/lib/mockups/types";

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * A table-based HTML signature with inline styles only, which is what Gmail, Outlook and
 * Apple Mail render reliably. It has no images, because many clients block embedded ones.
 */
export function signatureHtml(ctx: MockupContext): string {
  const { content, surface, brand } = ctx;
  const font = `'${brand.typography.body}', Arial, Helvetica, sans-serif`;
  const site = content.website.replace(/^https?:\/\//, "");
  const cell = `font-family:${font};font-size:13px;line-height:18px;color:#5b6170;`;
  return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
  <tr><td style="padding:0 0 8px 0;border-bottom:3px solid ${surface.primary};width:320px;"></td></tr>
  <tr><td style="padding:10px 0 0 0;font-family:${font};font-size:16px;line-height:22px;font-weight:700;color:#111827;">${escapeHtml(content.person)}</td></tr>
  <tr><td style="${cell}">${escapeHtml(content.role)}, <span style="color:${surface.primary};font-weight:600;">${escapeHtml(brand.name)}</span></td></tr>
  <tr><td style="${cell}padding-top:6px;">${escapeHtml(content.phone)}  |  <a href="https://${escapeHtml(site)}" style="color:${surface.primary};text-decoration:none;font-weight:600;">${escapeHtml(site)}</a>  |  <a href="mailto:${escapeHtml(content.email)}" style="color:#5b6170;text-decoration:none;">${escapeHtml(content.email)}</a></td></tr>
  <tr><td style="${cell}font-size:12px;color:#8a8f98;">${escapeHtml(content.address)}</td></tr>
</table>
`;
}
