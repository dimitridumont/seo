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

// Standard events (available in all projects)
sendGAEvent(GA_EVENTS.CLICK_PHONE)
sendGAEvent(GA_EVENTS.CLICK_EMAIL)
sendGAEvent(GA_EVENTS.CLICK_CONTACT)
sendGAEvent(GA_EVENTS.CLICK_DEVIS)
sendGAEvent(GA_EVENTS.CLICK_ADDRESS)
sendGAEvent(GA_EVENTS.CLICK_WHATSAPP)

// Custom project-specific events
sendGAEvent("click_on_audit_submit")
```
