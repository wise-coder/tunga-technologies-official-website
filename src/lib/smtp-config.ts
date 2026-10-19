import { isEmailAddress } from "./email-address";

export function getSmtpConfig(
  env: Record<string, string | undefined> = process.env,
) {
  const host = env.SMTP_HOST?.trim() || "smtp.gmail.com";
  const port = Number(env.SMTP_PORT || "465");
  const user = env.SMTP_USER?.trim() || "";
  const password = env.SMTP_APP_PASSWORD || "";
  const recipient = env.CONTACT_TO_EMAIL?.trim() || user;

  if (
    !isEmailAddress(user) ||
    !isEmailAddress(recipient) ||
    !password.trim() ||
    ![465, 587].includes(port) ||
    !/^[a-z0-9.-]+$/i.test(host)
  )
    return null;

  return {
    host,
    port,
    secure: port === 465,
    user,
    // Google displays app passwords in groups separated by spaces.
    password:
      host === "smtp.gmail.com" ? password.replace(/\s/g, "") : password,
    recipient,
  };
}
