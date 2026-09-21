import { NextRequest, NextResponse } from "next/server";
import { enquiryDeliveryReady } from "@/lib/form-config";
import { validateEnquiry, type Enquiry } from "@/lib/enquiry";

export const runtime = "nodejs";
// Best-effort per-instance protection. Add gateway/shared-store rate limiting when scaling.
const attempts = new Map<string, { count: number; expires: number }>();
const MAX_BYTES = 20_000;

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const allowedOrigins = [
    request.nextUrl.origin,
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, ""),
  ];
  if (origin && !allowedOrigins.includes(origin))
    return NextResponse.json(
      { message: "This request could not be accepted." },
      { status: 403 },
    );
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return NextResponse.json(
      { message: "Please submit the website form." },
      { status: 415 },
    );
  if (Number(request.headers.get("content-length")) > MAX_BYTES)
    return NextResponse.json(
      { message: "Your message is too long." },
      { status: 413 },
    );

  let data: Partial<Enquiry>;
  try {
    const reader = request.body?.getReader();
    if (!reader) throw new Error("Missing body");
    let size = 0;
    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BYTES) {
        await reader.cancel();
        return NextResponse.json(
          { message: "Your message is too long." },
          { status: 413 },
        );
      }
      chunks.push(value);
    }
    data = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!data || typeof data !== "object" || Array.isArray(data))
      throw new Error("Invalid object");
  } catch {
    return NextResponse.json(
      { message: "The form could not be read. Please try again." },
      { status: 400 },
    );
  }

  if (data.website)
    return NextResponse.json(
      { message: "This request could not be accepted." },
      { status: 400 },
    );
  const errors = validateEnquiry(data);
  if (Object.keys(errors).length)
    return NextResponse.json(
      { message: "Please check the highlighted fields.", errors },
      { status: 400 },
    );
  if (!enquiryDeliveryReady())
    return NextResponse.json(
      {
        message:
          "Online enquiries are not available yet. Your message has not been sent or saved.",
      },
      { status: 503 },
    );

  const now = Date.now();
  for (const [key, attempt] of attempts)
    if (attempt.expires <= now) attempts.delete(key);
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const attempt = attempts.get(ip) || { count: 0, expires: now + 60_000 };
  if (attempt.count >= 5 || attempts.size > 10_000)
    return NextResponse.json(
      { message: "Please wait a minute before sending another enquiry." },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  attempts.set(ip, { count: attempt.count + 1, expires: attempt.expires });

  const text = (value: unknown) =>
    typeof value === "string" ? value.trim() : "";
  const enquiry = {
    kind: data.kind,
    name: text(data.name),
    organization: text(data.organization),
    role: text(data.role),
    email: text(data.email),
    phone: text(data.phone),
    topic: text(data.topic),
    message: text(data.message),
    consent: true,
    submittedAt: new Date().toISOString(),
  };
  try {
    const response = await fetch(process.env.CONTACT_WEBHOOK_URL!, {
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
    return NextResponse.json({ message: "Your enquiry has been received." });
  } catch {
    // Do not log form contents or expose endpoint/credential details.
    return NextResponse.json(
      { message: "We couldn’t confirm delivery. Please try again shortly." },
      { status: 502 },
    );
  }
}
