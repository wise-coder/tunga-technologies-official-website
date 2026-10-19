import "server-only";
import nodemailer from "nodemailer";
import { createEnquiryEmail, type SubmittedEnquiry } from "./enquiry-email";
import { getSmtpConfig } from "./smtp-config";

export async function deliverEnquiry(enquiry: SubmittedEnquiry) {
  const smtp = getSmtpConfig();
  if (smtp) {
    const transport = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      requireTLS: true,
      auth: { user: smtp.user, pass: smtp.password },
      connectionTimeout: 8_000,
      greetingTimeout: 8_000,
      socketTimeout: 12_000,
      disableFileAccess: true,
      disableUrlAccess: true,
    });
    try {
      const result = await transport.sendMail({
        from: { name: "Tunga Technologies", address: smtp.user },
        to: smtp.recipient,
        ...createEnquiryEmail(enquiry),
      });
      if (!result.accepted.length || result.rejected.length) {
        throw new Error("Email recipient was not accepted");
      }
    } finally {
      transport.close();
    }
    return;
  }

  // Retain the existing webhook option for installations that already use it.
  const url = process.env.CONTACT_WEBHOOK_URL;
  if (!url?.startsWith("https://"))
    throw new Error("Delivery is not configured");
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.CONTACT_WEBHOOK_TOKEN
        ? { Authorization: `Bearer ${process.env.CONTACT_WEBHOOK_TOKEN}` }
        : {}),
    },
    body: JSON.stringify(enquiry),
    signal: AbortSignal.timeout(10_000),
    redirect: "error",
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Destination rejected request");
}
