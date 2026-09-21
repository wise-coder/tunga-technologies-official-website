import "server-only";
import { legal } from "@/content/legal";

export function enquiryDeliveryReady() {
  return Boolean(
    legal.approved &&
    legal.privacyContact &&
    legal.retention &&
    process.env.CONTACT_WEBHOOK_URL?.startsWith("https://"),
  );
}
