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
- `buildLocalBusinessSchema` — LocalBusiness with address, services, reviews, ratings, `amenityFeatures`, `hasOfferCatalog`
- `buildOrganizationSchema` — Organization with logo, social links, `founders`
- `buildWebsiteSchema` — WebSite
- `buildFaqSchema` — FAQPage
- `buildBreadcrumbSchema` — BreadcrumbList
- `buildServiceSchema` — Service with provider, area served, `hasOfferCatalog`, `workExample`
- `sanitizeJsonLd` — XSS protection for raw JSON-LD strings

Every option above is optional: pass none of them and the emitted JSON-LD is
exactly what it was before they existed. `founders` is for sites with author
pages to link back to; `hasOfferCatalog` and `workExample` for sites listing
several offers or past work under one service.

On `buildLocalBusinessSchema`, `hasOfferCatalog` takes a catalog written by
hand, priced products for instance, and replaces the one `services` would
build. `amenityFeatures` lists what the place offers (24/7 access, parking).
`images` and `paymentAccepted` take a single string as well as an array, and
emit it as given.

### Analytics

Load the tag once, in the root layout:

```tsx
import { GoogleAnalytics } from "@hexa-web/seo/analytics"

<GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
```

It renders nothing outside `NODE_ENV === "production"`, so a `npm run dev`
session never reaches the property. It declares the `gtag` stub as soon as the
page is interactive and defers the 191 KB of `gtag.js` to `lazyOnload`: clicks
that happen before the file lands are queued in `dataLayer` and replayed, they
are not lost. Write it by hand and it is easy to put the stub on `lazyOnload`
too, which silently drops every click until the window `load` event.

```ts
import { GA_EVENTS, sendGAEvent } from "@hexa-web/seo/analytics"

sendGAEvent(GA_EVENTS.CLICK_PHONE)
sendGAEvent(GA_EVENTS.CLICK_PHONE, { section: "hero" })
```

The second argument is optional and goes straight to GA4 as event parameters.
Without it, nothing changes. If `gtag` does not exist yet, `sendGAEvent`
recreates Google's own stub and pushes to `dataLayer`, so the event survives.

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
