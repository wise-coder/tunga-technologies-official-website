// Keep the notice aligned with the production hosting and email configuration.
export const legal = {
  approved: process.env.LEGAL_APPROVED === "true",
  privacyContact: process.env.PRIVACY_CONTACT_EMAIL || "",
  retention: process.env.ENQUIRY_RETENTION || "",
  privacy: [
    {
      heading: "Information in an enquiry",
      text: "The contact form asks for your name, email address, topic and message. Organization and phone number are optional. The partnership form also asks for your organization, role and partnership interest.",
    },
    {
      heading: "How enquiries are used",
      text: "Information submitted through these forms is intended to help Tunga Technologies review your enquiry and respond using the contact details you provide. Please do not include sensitive personal information in your message.",
    },
    {
      heading: "Website technology",
      text: "This website is hosted on Vercel. Vercel processes technical request information to serve and secure the website. This frontend does not include advertising trackers or analytics cookies.",
    },
    {
      heading: "How enquiries are delivered",
      text: "When you submit a form, your enquiry is sent to our team through Gmail, provided by Google. Google processes and stores the email to deliver it and make it available in our enquiry mailbox. We use the contact details you provide to reply. The website does not keep a separate database copy of your enquiry.",
    },
    {
      heading: "External platforms",
      text: "Links to e-tungo and other external websites take you to a separate service. Review the information provided by that service before sharing personal information.",
    },
  ],
  terms: [
    {
      heading: "About this website",
      text: "This website introduces Tunga Technologies, its products, approach and opportunities for collaboration. Product information may change as solutions develop.",
    },
    {
      heading: "Product access",
      text: "The e-tungo link opens a separate platform. Use of that platform is subject to the terms published there.",
    },
    {
      heading: "Published information",
      text: "Impact figures on this website include their available source or reporting context. Figures that have not been verified are shown as unavailable.",
    },
    {
      heading: "Enquiries",
      text: "Sending an enquiry starts a conversation. It does not create a partnership, investment commitment or service agreement.",
    },
  ],
};
