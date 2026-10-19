import { expect, test } from "@playwright/test";
import nodemailer from "nodemailer";
import {
  createEnquiryEmail,
  type SubmittedEnquiry,
} from "../src/lib/enquiry-email";
import { getSmtpConfig } from "../src/lib/smtp-config";
import { validateEnquiry } from "../src/lib/enquiry";

const enquiry: SubmittedEnquiry = {
  kind: "contact",
  name: "Aline & Partners",
  organization: "",
  role: "",
  email: "aline@example.com",
  phone: "+250 788 123 456",
  topic: "General enquiry",
  message:
    "We would like to discuss a new project.\nPlease contact us next week.",
  consent: true,
  submittedAt: "2026-10-17T09:30:00.000Z",
};

test("email layout fits desktop and mobile screens", async ({
  page,
}, testInfo) => {
  for (const width of [600, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.setContent(createEnquiryEmail(enquiry).html);
    await expect(
      page.getByRole("heading", { name: "New website enquiry" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Reply to client" }),
    ).toHaveAttribute("href", /^mailto:aline%40example.com/);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: testInfo.outputPath(`enquiry-email-${width}.png`),
      fullPage: true,
    });
  }
});

test("email escapes visitor HTML and preserves message paragraphs", () => {
  const email = createEnquiryEmail({
    ...enquiry,
    name: '<img src=x onerror="alert(1)">',
    message: "<script>alert('test')</script>\nSecond line & details",
  });
  expect(email.html).not.toContain("<script>");
  expect(email.html).not.toContain("<img src=x");
  expect(email.html).toContain("&lt;script&gt;");
  expect(email.html).toContain("<br>Second line &amp; details");
  expect(email.text).toContain(
    "<script>alert('test')</script>\nSecond line & details",
  );
});

test("email includes contact details and partnership fields only when supplied", () => {
  const contact = createEnquiryEmail(enquiry);
  expect(contact.text).toContain("Phone: +250 788 123 456");
  expect(contact.text).not.toContain("Organization:");
  expect(contact.html).toContain("2026-10-17 09:30:00 UTC");
  const partnership = createEnquiryEmail({
    ...enquiry,
    kind: "partnership",
    organization: "Example Cooperative",
    role: "Director",
  });
  expect(partnership.html).toContain("New partnership enquiry");
  expect(partnership.text).toContain("Organization: Example Cooperative");
  expect(partnership.text).toContain("Role / title: Director");
});

test("generated MIME email has the authenticated sender, client reply address, and both body formats", async () => {
  const transport = nodemailer.createTransport({
    streamTransport: true,
    buffer: true,
    newline: "unix",
  });
  const result = await transport.sendMail({
    from: { name: "Tunga Technologies", address: "sender@example.com" },
    to: "team@example.com",
    ...createEnquiryEmail(enquiry),
  });
  const mime = result.message.toString();
  expect(mime).toContain("From: Tunga Technologies <sender@example.com>");
  expect(mime).toContain("To: team@example.com");
  expect(mime).toMatch(/Reply-To:.*aline@example.com/);
  expect(mime).toContain("Content-Type: text/plain");
  expect(mime).toContain("Content-Type: text/html");
  expect(mime).not.toContain("Bcc:");
});

test("SMTP configuration requires credentials and defaults to Gmail with the sender as recipient", () => {
  expect(getSmtpConfig({})).toBeNull();
  expect(getSmtpConfig({ SMTP_USER: "team@example.com" })).toBeNull();
  expect(
    getSmtpConfig({
      SMTP_USER: "team@example.com",
      SMTP_APP_PASSWORD: "abcd efgh ijkl mnop",
    }),
  ).toMatchObject({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    recipient: "team@example.com",
    password: "abcdefghijklmnop",
  });
  expect(
    getSmtpConfig({
      SMTP_USER: "sender@example.com",
      SMTP_APP_PASSWORD: "password",
      SMTP_HOST: "smtp.example.com",
      SMTP_PORT: "587",
      CONTACT_TO_EMAIL: "team@example.com",
    }),
  ).toMatchObject({ port: 587, secure: false, recipient: "team@example.com" });
});

test("SMTP rejects unsafe ports and multiple receiving mailboxes", () => {
  const env = {
    SMTP_USER: "sender@example.com",
    SMTP_APP_PASSWORD: "password",
  };
  expect(getSmtpConfig({ ...env, SMTP_PORT: "25" })).toBeNull();
  expect(
    getSmtpConfig({
      ...env,
      CONTACT_TO_EMAIL: "one@example.com,two@example.com",
    }),
  ).toBeNull();
  expect(
    getSmtpConfig({ ...env, SMTP_USER: "Name <sender@example.com>" }),
  ).toBeNull();
});

test("form validation rejects email header and recipient injection", () => {
  for (const email of [
    "client@example.com\r\nBcc: attacker@example.com",
    "one,two@example.com",
    "Name<client@example.com>",
  ]) {
    expect(validateEnquiry({ ...enquiry, email }).email).toBeTruthy();
  }
  expect(validateEnquiry(enquiry)).toEqual({});
});
