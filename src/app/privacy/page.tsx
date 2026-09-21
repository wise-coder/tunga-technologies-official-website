import { LegalPage } from "@/components/legal-page";
import { legal } from "@/content/legal";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Privacy notice",
  "Information about personal data shared with Tunga Technologies through website enquiries.",
  "/privacy",
  legal.approved,
);
export default function PrivacyPage() {
  return <LegalPage kind="privacy" />;
}
