# @hexa-web/seo

Shared JSON-LD builders and GA4 analytics helpers for Hexa Web projects.

## Install

```bash
npm install dimitridumont/seo
```

## Usage

### JSON-LD

```tsx
import {
  buildLocalBusinessSchema,
  buildFaqSchema,
  buildWebsiteSchema,
  JsonLdScripts,
} from "@hexa-web/seo/json-ld"

const schemas = [
  buildLocalBusinessSchema({ name: "...", ... }),
  buildFaqSchema([{ question: "...", answer: "..." }]),
  buildWebsiteSchema({ name: "...", description: "...", url: "..." }),
]

// In your layout
<JsonLdScripts schemas={schemas} />
```

Available builders:
- `buildLocalBusinessSchema` — LocalBusiness with address, services, reviews, ratings
- `buildOrganizationSchema` — Organization with logo, social links
- `buildWebsiteSchema` — WebSite
- `buildFaqSchema` — FAQPage
- `buildBreadcrumbSchema` — BreadcrumbList
- `buildServiceSchema` — Service with provider and area served
- `sanitizeJsonLd` — XSS protection for raw JSON-LD strings

### Analytics

```ts
import { GA_EVENTS, sendGAEvent } from "@hexa-web/seo/analytics"

sendGAEvent(GA_EVENTS.CLICK_PHONE)
```

Same event for the same thing on every site: the monthly report counts them
by name.

| Event            | Fire on         | Counted as a contact |
| ---------------- | --------------- | -------------------- |
| `CLICK_PHONE`    | phone link      | yes                  |
| `CLICK_EMAIL`    | email link      | yes                  |
| `CLICK_WHATSAPP` | WhatsApp link   | yes                  |
| `CLICK_CONTACT`  | CTA to the form | yes                  |
| `CLICK_DEVIS`    | form **sent**   | yes                  |
| `CLICK_ADDRESS`  | maps link       | no                   |
| `CLICK_AVIS`     | Google profile  | no                   |

A click leading to the form is `CLICK_CONTACT`, never `CLICK_DEVIS`, or one
visitor counts twice. A link leaving the site for something that is not a way
to reach the client is not a contact.

Anything else stays project-specific, and stays out of the report:

```ts
sendGAEvent("click_on_audit_submit")
```
