import { partnershipTypes } from "@/content/site";

export const contactTopics = [
  "General enquiry",
  "Product question",
  "Partnership idea",
  "Careers & collaboration",
  "Other",
];
export type EnquiryKind = "contact" | "partnership";
export type Enquiry = {
  kind: EnquiryKind;
  name: string;
  organization: string;
  role: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
  consent: boolean;
  website: string;
};
export type FieldErrors = Partial<Record<keyof Enquiry, string>>;

export function validateEnquiry(value: Partial<Enquiry>): FieldErrors {
  const errors: FieldErrors = {};
  const text = (field: keyof Enquiry) =>
    typeof value[field] === "string" ? (value[field] as string).trim() : "";
  if (value.kind !== "contact" && value.kind !== "partnership")
    errors.kind = "Choose a valid enquiry type.";
  if (text("name").length < 2)
    errors.name = "Please enter your name (at least 2 characters).";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text("email")))
    errors.email = "Please enter a valid email address.";
  if (value.kind === "partnership" && !text("organization"))
    errors.organization = "Please enter your organization.";
  if (value.kind === "partnership" && !text("role"))
    errors.role = "Please enter your role or title.";
  const topics =
    value.kind === "partnership"
      ? partnershipTypes.map((type) => type.title)
      : contactTopics;
  if (!topics.includes(text("topic")))
    errors.topic = "Please select an option.";
  if (text("message").length < 20)
    errors.message =
      "Please share a little more detail (at least 20 characters).";
  if (text("message").length > 5000)
    errors.message = "Please keep your message to 5,000 characters.";
  if (text("phone") && !/^[+()\d\s.-]{6,40}$/.test(text("phone")))
    errors.phone = "Please enter a valid phone number, or leave it blank.";
  for (const key of ["name", "organization", "role", "email"] as const)
    if (text(key).length > 200)
      errors[key] = "Please use no more than 200 characters.";
  if (value.consent !== true)
    errors.consent = "Please confirm that we may use your details to respond.";
  return errors;
}
