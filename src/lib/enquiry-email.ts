import type { Enquiry } from "./enquiry";

export type SubmittedEnquiry = Omit<Enquiry, "website"> & {
  submittedAt: string;
};

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character]!,
  );
}

export function createEnquiryEmail(enquiry: SubmittedEnquiry) {
  const title =
    enquiry.kind === "partnership"
      ? "New partnership enquiry"
      : "New website enquiry";
  const subject = `[Tunga Technologies] ${enquiry.topic}`;
  const details = [
    ["Name", enquiry.name],
    ["Email", enquiry.email],
    ["Organization", enquiry.organization],
    ["Role / title", enquiry.role],
    ["Phone", enquiry.phone],
    ["Topic", enquiry.topic],
    [
      "Received (UTC)",
      new Date(enquiry.submittedAt)
        .toISOString()
        .replace("T", " ")
        .replace(/\.\d{3}Z$/, " UTC"),
    ],
  ].filter(([, value]) => value);
  const rows = details
    .map(
      ([label, value]) => `<tr>
    <td style="padding:12px 0;border-bottom:1px solid #e5edf5;color:#54667c;font-size:13px;vertical-align:top;width:34%;">${escapeHtml(label)}</td>
    <td style="padding:12px 0 12px 16px;border-bottom:1px solid #e5edf5;color:#102c4b;font-size:14px;overflow-wrap:anywhere;word-break:break-word;">${escapeHtml(value)}</td>
  </tr>`,
    )
    .join("");
  const replyUrl = `mailto:${encodeURIComponent(enquiry.email)}?subject=${encodeURIComponent(`Re: ${enquiry.topic}`)}`;

  return {
    subject,
    replyTo: {
      name: enquiry.name.replace(/[\r\n]/g, " "),
      address: enquiry.email,
    },
    text: [
      "TUNGA TECHNOLOGIES",
      title,
      "",
      ...details.map(([label, value]) => `${label}: ${value}`),
      "",
      "MESSAGE",
      enquiry.message,
      "",
      "The client agreed to the use of their details to respond to this enquiry.",
      "Reply to this email to respond directly to the client.",
    ].join("\n"),
    html: `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:0;background:#f2f6fa;font-family:Arial,Helvetica,sans-serif;color:#102c4b;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f2f6fa;"><tr><td align="center" style="padding:28px 12px;">
<table role="presentation" width="600" cellspacing="0" cellpadding="0" style="width:100%;max-width:600px;background:#ffffff;border:1px solid #dfe8f1;border-radius:12px;overflow:hidden;">
<tr><td style="background:#064f9e;padding:28px 24px;color:#ffffff;">
<p style="margin:0 0 16px;font-size:12px;letter-spacing:2px;font-weight:bold;">TUNGA TECHNOLOGIES</p>
<h1 style="margin:0;font-size:25px;line-height:1.3;">${title}</h1>
<p style="margin:12px 0 0;color:#dcecff;font-size:14px;line-height:1.6;">A client has reached out through your website.</p>
</td></tr>
<tr><td style="padding:12px 24px 24px;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="table-layout:fixed;">${rows}</table>
<h2 style="margin:28px 0 12px;font-size:16px;">Message</h2>
<div style="padding:20px;background:#f4f8fc;border-left:3px solid #176cc1;border-radius:4px;font-size:15px;line-height:1.8;overflow-wrap:anywhere;word-break:break-word;">${escapeHtml(enquiry.message).replace(/\r\n|\r|\n/g, "<br>")}</div>
<p style="margin:28px 0 16px;"><a href="${escapeHtml(replyUrl)}" style="display:inline-block;padding:14px 22px;background:#064f9e;color:#ffffff;border-radius:6px;text-decoration:none;font-size:14px;font-weight:bold;">Reply to client &rarr;</a></p>
<p style="margin:0;color:#54667c;font-size:12px;line-height:1.7;">You can also use Reply in your email app. Your response will be addressed to ${escapeHtml(enquiry.email)}.</p>
</td></tr>
<tr><td style="padding:20px 24px;border-top:1px solid #e5edf5;color:#66788c;font-size:11px;line-height:1.7;">Submitted through the Tunga Technologies ${enquiry.kind === "partnership" ? "partnership" : "contact"} form. The client agreed to the use of their details to respond to this enquiry.</td></tr>
</table></td></tr></table></body></html>`,
  };
}
