import "server-only";
import { legal } from "@/content/legal";
import { getSmtpConfig } from "./smtp-config";

export function enquiryDeliveryReady() {
  return Boolean(
    legal.approved &&
    legal.privacyContact &&
    legal.retention &&
    (getSmtpConfig() ||
      process.env.CONTACT_WEBHOOK_URL?.startsWith("https://")),
  );
}
