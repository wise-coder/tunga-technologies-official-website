# Tunga Technologies

Original public website for Tunga Technologies, built from the supplied September 2026 frontend handoff and the user's implementation request. Next.js App Router, React, TypeScript, Tailwind CSS, self-hosted Inter and Lucide icons.

## Run locally

Use Node.js 22.13+ (developed with Node 24) and npm.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

On PowerShell, use `Copy-Item .env.example .env.local`. Open http://localhost:3000.

```sh
npm run lint
npm run typecheck
npm run build
npm run start
npm test
npm run format:check
```

The Playwright suite uses locally installed Chrome. Install Chrome, or remove `channel: "chrome"` from `playwright.config.ts` and run `npx playwright install chromium`. Tests start the production server automatically; build first. Tests assume the default, unconfigured environment, with indexing and live enquiry delivery off. No tests send messages to a real recipient.

With the production server running, `npm run audit:mobile` writes mobile Lighthouse HTML and JSON reports to `.reference/`. This local audit uses Chrome's debugging port 9223. Set `AUDIT_URL` to audit another origin. A staging SEO score is reduced by intentional noindex/robots restrictions.

## Routes

| Route                           | Content                                                                   |
| ------------------------------- | ------------------------------------------------------------------------- |
| `/`                             | Company positioning, products, process, impact and partnership invitation |
| `/about`                        | Purpose, mission, vision, approach and values                             |
| `/solutions`                    | Live product portfolio and product selection criteria                     |
| `/solutions/e-tungo`            | Product case study, challenge, response, audiences and evidence           |
| `/impact`                       | Source-backed metrics and four-part impact framework                      |
| `/insights`                     | Editorial index with an honest, noindex empty state                       |
| `/insights/[slug]`              | Published articles only; unknown/draft slugs return 404                   |
| `/partners`                     | Five partnership categories and enquiry form                              |
| `/contact`                      | Contact form and configured company channels                              |
| `/privacy`                      | Draft privacy notice, noindex until approved                              |
| `/terms`                        | Draft website terms, noindex until approved                               |
| `/api/enquiries`                | Validated, server-only enquiry delivery endpoint                          |
| `/robots.txt`, `/sitemap.xml`   | Environment-aware crawler configuration                                   |
| `/icon.svg`, `/opengraph-image` | Original favicon and generated social image                               |

## Content and components

Content lives in `src/content/`:

- `site.ts`: navigation, company channels, positioning, approach, values and partnership types.
- `solutions.ts`: typed product catalogue, product steps, selection criteria and approved screenshots.
- `impact.ts`: typed metrics with values, source, reporting period and notes. Metrics without a source are displayed as unavailable.
- `insights.ts`: typed editorial content. Only `published: true` articles with a non-future date are public.
- `legal.ts`: clearly labelled draft notices. Replace with company-approved text before enabling collection.

Shared components in `src/components/`:

- Header and accessible dialog-based mobile navigation, Footer.
- Wordmark, BrandMark, ProgressVisual and HillsVisual.
- Container, Button, TextLink, SectionKicker, SectionHeader, Hero, Breadcrumbs and EmptyState.
- SolutionCard, ProductVisual, ProcessSteps, ImpactMetric, ImpactPreview, InsightCard, PartnerCard and CTASection.
- ContactForm with contact and partnership variants, and LegalPage.

The homepage's layered landscape and the blue hill illustration are original code-native SVGs. The e-tungo diagram is explicitly identified as a concept illustration. None of these are photographs, claimed product screenshots or evidence of impact.

## Enquiry delivery

Set server-only `CONTACT_WEBHOOK_URL` to your HTTPS receiver. `CONTACT_WEBHOOK_TOKEN`, if supplied, is sent as a Bearer authorization header. These variables are never sent to the browser.

Both forms validate on the client and server. Requests enforce JSON content, a 20KB limit, field lengths, topic allowlists, consent, a honeypot and a same-origin check for browser requests. A per-instance rate limit allows five valid submission attempts per minute per forwarded IP. Add shared-store or gateway rate limiting for multi-instance deployment and ensure your proxy overwrites forwarded IP headers.

Delivery is enabled only when the HTTPS receiver, `LEGAL_APPROVED=true`, `PRIVACY_CONTACT_EMAIL` and `ENQUIRY_RETENTION` are configured. The default state returns HTTP 503 and explicitly says the message was not sent or saved. This application does not keep a local database of enquiries or log their contents.

The receiver must accept and route this JSON to the correct recipient, and return 2xx only after accepting it:

```json
{
  "kind": "contact",
  "name": "Visitor name",
  "organization": "",
  "role": "",
  "email": "visitor@example.com",
  "phone": "",
  "topic": "General enquiry",
  "message": "The visitor's message",
  "consent": true,
  "submittedAt": "ISO 8601 timestamp"
}
```

Partnership submissions use `kind: "partnership"` and include organization, role and a selected partnership type in `topic`. A failed or timed-out receiver produces an error state, not a success message. A timeout can occur after a receiver accepts a message; operators should consider deduplication at the destination.

## Production configuration

1. Confirm the production origin in `NEXT_PUBLIC_SITE_URL` and rebuild. Without it, canonical/OG URLs intentionally use localhost.
2. Add verified contact and social channels to the environment. Blank values are hidden.
3. Replace draft legal text, identify hosting/enquiry processors and their actual practices, set the approved retention period and privacy contact, then set `LEGAL_APPROVED=true`.
4. Configure the enquiry receiver and verify a real delivery to the correct team.
5. Set `SITE_INDEXABLE=true` only on the production deployment. Preview deployments stay noindex. The default sitemap is empty and robots disallow crawling. Draft legal pages and an empty Insights index stay excluded.
6. Build and deploy to a Node-compatible Next.js host. An entirely static export cannot support the enquiry route handler. Rebuild after changing public metadata or statically rendered contact settings.

The explicit request included Insights in navigation, so it remains reachable despite the handoff's optional recommendation to hide it at launch. It contains no mock articles and remains noindex until approved articles exist.

## Company inputs still required

- Final approved Tunga SVG logo (the implementation includes an original provisional wordmark, mark and favicon).
- Confirmed production domain and the correct Tunga Git remote.
- Company email, optional phone and genuine social URLs.
- Approved privacy/terms copy, retention policy, privacy contact and enquiry receiver/API.
- Approved e-tungo screenshots: homepage, listing detail, sell flow and buyer-request flow if available. Add optimized WebP/AVIF files under `public/products/`, then register them in `productScreenshots`.
- Verified impact data with source and reporting period. One launched solution is supported by the provided handoff; no reach, district, connection or partner figures are invented.
- Approved editorial articles when available. No blog posts were fabricated.

Optional: permission-cleared Rwanda/product-use photography, team photography, and partner logos only if real relationships and publication permission exist. No photography is required for the current abstract design.

## Verification and delivery

See `docs/DELIVERY.md` for the final validation record and `docs/FILES.md` for the complete file inventory. Browser traces and local design references are ignored by Git. The supplied DOCX is not included in the repository.
