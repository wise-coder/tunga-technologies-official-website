# Contact email delivery on Vercel

Both the contact and partnership forms can send formatted emails directly to your inbox. They include the client's details, message, consent confirmation, and UTC submission time. Reply in your mail app to respond to the client. There is no automatic email to the visitor.

The selected sending and receiving mailbox is **serge.wiseabijuru5@gmail.com**. The local `.env.local` template has this address filled in; add the same settings in Vercel for production.

The privacy contact uses the same address. The selected retention period is **one week after receipt**. Remove enquiry emails from the mailbox (including Trash) after that period; the website cannot automatically delete Gmail messages.

## Gmail or Google Workspace

1. Enable 2-Step Verification on the Google account that will send the emails.
2. Create an app password at https://myaccount.google.com/apppasswords (name it `Tunga website`). Some managed accounts restrict app passwords; consult your administrator if the option is missing.
3. Open **Vercel > Project > Settings > Environment Variables**. Add the following to **Production**. Enter the actual app password only in Vercel, never in source code or chat.

| Key                     | Value                                                                                        |
| ----------------------- | -------------------------------------------------------------------------------------------- |
| `SMTP_HOST`             | `smtp.gmail.com`                                                                             |
| `SMTP_PORT`             | `465`                                                                                        |
| `SMTP_USER`             | `serge.wiseabijuru5@gmail.com`                                                               |
| `SMTP_APP_PASSWORD`     | The generated app password, not the normal account password                                  |
| `CONTACT_TO_EMAIL`      | `serge.wiseabijuru5@gmail.com`                                                               |
| `COMPANY_EMAIL`         | The public contact address shown on the site                                                 |
| `NEXT_PUBLIC_SITE_URL`  | Actual production URL, including `https://`, without a trailing slash                        |
| `PRIVACY_CONTACT_EMAIL` | `serge.wiseabijuru5@gmail.com`                                                               |
| `ENQUIRY_RETENTION`     | Client enquiries are kept for one week after receipt, then deleted from our enquiry mailbox. |
| `LEGAL_APPROVED`        | `true` after completing and approving `src/content/legal.ts`                                 |

The existing legal settings remain required. The privacy text now identifies Vercel hosting and Gmail delivery; review it before enabling production forms. The app does not delete mail from your inbox automatically; apply your retention policy there.

4. Deploy the code changes and redeploy after changing environment variables. Form availability is evaluated when the pages are built.
5. Submit one enquiry on `/contact` and one on `/partners`. Confirm the correct inbox receives both, inspect Spam if needed, and verify that Reply addresses the visitor.

For Preview deployments, configure a separate test inbox if you want to test submissions there. Do not prefix SMTP credentials with `NEXT_PUBLIC_`.

Google setup reference: https://support.google.com/accounts/answer/185833

## Other SMTP providers

Use the provider's SMTP hostname, full sending email address, and app password. Port `465` uses TLS immediately; `587` requires STARTTLS. The sender is the authenticated mailbox, and the visitor is set as Reply-To. TLS certificate verification stays enabled. Providers that require OAuth rather than app passwords need a separate integration.

## Existing webhook installations

`CONTACT_WEBHOOK_URL` and optional `CONTACT_WEBHOOK_TOKEN` remain supported. Valid SMTP settings take priority. A failed SMTP attempt does not fall back to the webhook, avoiding duplicate delivery. The webhook is unnecessary for Gmail delivery.

## Delivery behavior and troubleshooting

- Success means the SMTP server accepted the message; inbox placement is controlled by the email provider. No local database copy is stored.
- Authentication or connection failure produces an error and keeps the form contents for retry. Check the host, port, full email address, app password, and Google account restrictions.
- A timeout can occur after the provider accepted an email, so a manual retry can produce a duplicate. There is no background retry queue.
- SMTP is used only on the server. Submitted HTML is escaped, a plain-text version is included, and the recipient comes only from server settings.
- Existing validation, honeypot, origin checks, payload limit, and per-instance rate limit remain in place. The per-instance limit is best-effort on Vercel; it is not a shared rate limit across all instances.
- `Online enquiries are not available yet` means SMTP/webhook configuration or one of the legal settings above is missing. Correct the settings and redeploy.
