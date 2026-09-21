import { LegalPage } from "@/components/legal-page";
import { legal } from "@/content/legal";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Website terms",
  "Terms and information for the Tunga Technologies public website.",
  "/terms",
  legal.approved,
);
export default function TermsPage() {
  return <LegalPage kind="terms" />;
}
