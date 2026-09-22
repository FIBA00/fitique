# Fitique Product Roadmap

## Purpose and current baseline

Fitique already has a strong **boutique shopping shell**: editorial discovery, catalogue filters and sorting, product pages, a quick view, a local bag and wishlist, Fit Check with profile/history comparison, an order journey, PWA support, and a cache-first client data layer. The application is now **integration-ready**, rather than production-commerce-ready. Payment, notifications, stock, fulfilment, and catalogue operations need live systems behind the prepared interfaces before a public launch.

> **Product principle:** do not add every possible feature at once. First make the promise of “the right piece, in the right size, delivered with confidence” trustworthy end to end. Then compound the differentiators: fit intelligence, editorial curation, and wardrobe memory.

## Priority definitions

| Priority | Meaning | Release decision |
|---|---|---|
| **P0 — Launch blocker** | Required to take real orders safely, fulfil them, support customers, and meet baseline quality expectations. | Build before accepting a real payment or public traffic. |
| **P1 — Early growth** | Meaningfully improves conversion, retention, support efficiency, or merchandising after the core launch works. | Build in the first post-launch releases. |
| **P2 — Differentiation** | Creates a stronger fashion-service advantage but depends on healthy core data and operations. | Build after the P0 and selected P1 foundation is proven. |
| **P3 — Optional expansion** | Valuable in a specific market or business model, but not a default launch requirement. | Decide from user demand and operating strategy. |

## P0: launch-critical customer and commerce capabilities

| Area | Remaining feature | What “done” looks like | Current Fitique status |
|---|---|---|---|
| **Checkout and payments** | Real hosted checkout or payment elements | The client creates a payment session, redirects or mounts provider fields, confirms completion only from server-verified payment status, and handles failure/cancellation. | **Interface complete; backend required.** |
| **Payment webhooks** | Idempotent payment event processing | A verified webhook updates payment and order state exactly once, even when the provider retries events. Refund, cancellation, and dispute events are logged. | Not started. |
| **Order lifecycle** | Canonical order, payment, and fulfilment records | Orders use persistent IDs, line-item snapshots, currency, tax, discounts, payment status, and an immutable event log. | UI and cached API seams exist; persistent commerce model remains required. |
| **Catalogue and inventory** | Product information management with variants | Admin-managed product, SKU, size, colour, price, image, size-chart, inventory, and publication state. The shop never sells unavailable stock. | Static/mock catalogue only. |
| **Shipping and fulfilment** | Delivery-zone, rate, and fulfilment integration | A shopper sees eligible delivery methods and accurate charge/ETA before paying; the fulfilment team can allocate, pack, and dispatch. | UI ready; no carrier or fulfilment source. |
| **Tracking** | Real carrier, tracking ID, and timestamped events | Carrier webhooks or polling populate `carrier`, `trackingId`, `trackingUrl`, event status, event time, and delivery exceptions. | **Interface and query hooks complete; backend required.** |
| **Notifications** | Transactional email, SMS, and push pipeline | Opt-in rules are respected; templates cover order placed, payment failed, dispatched, delayed, out for delivery, delivered, return updates, and unsubscribe management. | **Preferences UI and cached API seams complete; delivery service required.** |
| **Returns and exchanges** | Self-service return/exchange flow | Customers can request a return, choose reason, generate a label/instructions, see status, and receive refund/store-credit/exchange updates. | Not started. |
| **Customer support** | Contact, help centre, and order-aware support handoff | Help articles and contact paths appear in the checkout, order, and return journeys; support can securely identify an order. | Basic contact only. |
| **Authentication and account security** | Production authentication hardening | Account recovery, verified contact points, session management, rate limits, role boundaries, security event logging, and secure logout are handled. | OAuth foundation exists; production hardening remains. |
| **Privacy and Fit Check consent** | Fit-photo privacy operations | Explicit consent, separate usage purpose, signed/private photo access, retention rules, deletion/export requests, and clear limitations are implemented. | Consent and private-profile direction exist; policy and operations remain. |
| **Legal and trust** | Customer-facing policy surfaces | Accessible privacy, terms, shipping, returns, size/fit limitations, and cookie/consent notices are available before purchase. | Not started. |

## P0: quality, security, and launch operations

| Area | Remaining feature | Practical scope |
|---|---|---|
| **Accessibility** | Accessibility audit and fixes | Keyboard-only journeys, visible focus, semantic labels, contrast, image alternative text, form error announcements, and reduced-motion checks for every purchase-critical screen. |
| **Performance** | Measured performance budgets | Responsive image sizes, lazy loading, bundle splitting, caching headers, Core Web Vitals monitoring, and slow-network verification. The current build has a large shared JavaScript chunk that should be split before broad paid traffic. |
| **SEO and sharing** | Public product and collection metadata | Per-product titles/descriptions, canonical URLs, `robots.txt`, sitemap, structured product data, social preview cards, and a decision on SSR/prerendering for crawler-visible catalogue pages. |
| **Error handling** | Observability and recovery | Client/server error tracking, structured logs, alerting, request IDs, operational dashboards, and user-friendly retry states for every external dependency. |
| **Security controls** | API and data protection baseline | Server-side authorization checks, rate limiting, CSRF strategy, input validation, content security policy, secure secret storage, upload malware/type/size checks, and dependency monitoring. |
| **Testing** | Production confidence suite | Unit tests for business rules, contract tests for provider payloads, integration tests for API routes, and end-to-end purchase/return/Fit Check tests. Test payment and carrier integrations against sandboxes. |
| **Administration** | Minimum internal operations console | Roles for catalogue, order, fulfilment, and support; inventory adjustments; refund/return processing; audit trail; and a controlled way to re-send transactional messages. |
| **Analytics** | Privacy-conscious commerce instrumentation | Funnel events for view product, quick view, add to bag, Fit Check start/result, checkout start, payment success/failure, return request, and notification opt-in. Include consent-aware analytics configuration. |

## P1: conversion, service, and retention

| Theme | Feature | Why it is worth adding after launch |
|---|---|---|
| **Merchandising** | Collection landing pages, seasonal edits, landing-page CMS, editorial lookbooks, and product badges managed by staff. | Lets a fashion team change the shop without deployments. |
| **Discovery** | Better filtering by silhouette, fabric, occasion, length, sleeve, colour family, price, and availability; saved searches. | Reduces catalogue friction when the collection grows. |
| **Size confidence** | Product-level size charts, size conversion, fit notes, garment measurements, and a “compare with a piece you own” workflow. | Converts Fit Check from an estimate into a more transparent decision tool. |
| **Fit feedback loop** | Post-delivery fit feedback and verified return-reason capture. | Produces the labelled data needed to improve Fit Check recommendations responsibly. |
| **Wishlist and alerts** | Server-synced wishlist, back-in-stock alerts, price-drop alerts, and low-stock notices with opt-in controls. | Gives shoppers a reason to return without adding pressure everywhere. |
| **Promotion engine** | Discount codes, automatic campaigns, first-order incentives, gift cards, store credit, and eligibility rules. | Supports marketing without manual order adjustments. |
| **Customer service** | Order modification window, address correction, cancellation flow, exchange alternatives, and order notes. | Reduces inbound support tickets and protects conversion. |
| **Social proof** | Verified-buyer reviews, Q&A, sizing feedback, and moderation. | Add only with real collection, verification, reporting, and moderation. Never manufacture reviews, ratings, or testimonials. |
| **Lifecycle messaging** | Welcome series, abandoned bag, Fit Check follow-up, back-in-stock, and post-delivery care sequences. | Uses behaviour and consent to support—not overwhelm—the customer. |
| **Analytics** | Merchandise dashboard: sell-through, sizes sold, return rate by SKU/size, Fit Check conversion, and delivery performance. | Gives buying and operations teams practical decisions from real data. |

## P2: Fitique differentiation

| Opportunity | Feature set | Guardrails and dependencies |
|---|---|---|
| **Personal wardrobe** | Purchases, saved pieces, owned-item cataloguing, colour palette, outfit boards, and occasion planning. | Requires strong account privacy, deletion controls, and clear recommendations. |
| **Stylist companion** | AI-assisted outfit pairing, packing lists, event styling, capsule wardrobe building, and a human stylist escalation path. | Keep outputs advisory, explain uncertainty, and never make unsupported body or health claims. |
| **Fit intelligence** | Brand/garment fit calibration, user corrections, confidence explanations, product-specific guidance, and feedback-trained ranking. | Requires consented, high-quality outcome data; measure accuracy by return/fit feedback. |
| **Visual discovery** | Shop-the-look, image upload search, colour matching, and similar-item discovery. | Needs image rights, content moderation, and clear photo handling rules. |
| **Delivery experience** | Delivery-slot management, live map where reliable, concierge handoff, try-at-home appointment scheduling, and proactive exception recovery. | Depends on carrier/fulfilment integrations and local service coverage. |
| **Community** | Customer-created looks, event collaborations, creator curation, and verified photo reviews. | Launch only with moderation, consent, reporting, and a real community operations plan. |

## P3: market-dependent expansion

| Feature | When it becomes appropriate |
|---|---|
| Multi-currency, multi-language, duties/taxes, and regional catalogue rules | When Fitique has a confirmed cross-border fulfilment and support model. |
| Local payment methods | When analytics show meaningful demand in a specific market. |
| Loyalty tiers, referrals, and subscriptions | When repeat purchase rate and margin support a rewards programme. |
| Physical boutique inventory and clienteling | When stores, pop-ups, or appointment-based service are part of the operating model. |
| Marketplace or third-party brand onboarding | Only after SKU, fulfilment, payout, quality control, and seller-support operations are mature. |

## Recommended API contract and cache map

The current client has shared TanStack Query keys and resource-specific cache policies. The following endpoints complete the intended contract. Return stable IDs, ISO/UTC timestamps, `updatedAt`, and a version or ETag where possible.

| Resource | Suggested API surface | Client cache policy | Invalidation trigger |
|---|---|---|---|
| Catalogue | `GET /products`, `GET /products/:id`, `GET /categories` | 2–15 minutes | Catalogue publish, inventory/price change. |
| Account | `GET/PATCH /profile` | 5 minutes | Profile, address, preference, or sign-in change. |
| Fit profile/history | Existing protected Fit Check procedures or equivalent REST endpoints | 1–3 minutes | Fit profile save or Fit Check completion. |
| Wishlist | `GET/PUT /wishlist` | 1–2 minutes | Add/remove product; optimistic update. |
| Bag and checkout quote | `POST /carts/quote` or server cart endpoints | Short-lived (15–60 seconds) | Quantity, address, promotion, shipping-method, or stock change. |
| Payment methods | `GET /payments/methods` | 30 seconds | Currency, region, address, or eligibility change. |
| Payment session | `POST /payments/sessions`, `GET /payments/sessions/:orderId` | 30 seconds | Payment event webhook, completion, cancellation, expiry. |
| Orders | `GET /orders`, `GET /orders/:id` | 45 seconds | Payment, fulfilment, return, refund, or order-edit event. |
| Delivery record | `GET /deliveries/:orderId` | 30 seconds | Carrier event, address change, delivery exception. |
| Delivery events | `GET /deliveries/:orderId/events` | 15 seconds | Any carrier webhook/poll update. |
| Notification preferences | `GET/PUT /deliveries/:orderId/notification-preferences` | 30 seconds | User toggle; optimistic update with rollback. |
| Returns | `GET/POST /returns`, `GET /returns/:id` | 30–60 seconds | Return request, label creation, carrier scan, inspection, refund. |

> Keep payment confirmation and fulfilment changes **server-authoritative**. The browser may display a pending result, but the order state should change only after a verified provider or fulfilment event is processed by the backend.

## Recommended delivery sequence

| Release | Outcome | Scope |
|---|---|---|
| **Release A — Commerce core** | Fitique can sell, pay, and fulfil safely. | P0 payments/webhooks, product/SKU/inventory data, order lifecycle, tax/shipping quote, carrier tracking, transactional notifications, returns, policies, support. |
| **Release B — Trust and optimisation** | The purchase journey is measurable, accessible, and reliable. | P0 performance/accessibility/security/observability/SEO/testing plus analytics and admin tools. |
| **Release C — Conversion loop** | Customers can discover, decide, and return with more confidence. | P1 product data, size tools, fit feedback, server wishlist, alerts, campaigns, customer-service tools. |
| **Release D — Fitique advantage** | Fitique becomes a personal fashion service, not only a shop. | Selected P2 wardrobe, stylist, Fit intelligence, and delivery-concierge features. |

## Decisions to make before implementation

| Decision | Why it changes the architecture |
|---|---|
| Payment provider and countries/currencies | Determines checkout, webhooks, taxes, recurring fees, fraud controls, and local methods. |
| Catalogue source of truth | Determines whether product/SKU/inventory data is maintained in Fitique, a headless commerce platform, a PIM, or an ERP. |
| Fulfilment and carrier model | Determines delivery slots, tracking quality, returns labels, fulfilment events, and customer promises. |
| Fit Check data policy | Determines photo retention, model provider terms, permissions, private storage, and deletion/export workflows. |
| Brand operating model | Determines whether features prioritise editorial curation, high-SKU marketplace scale, a try-at-home service, physical clienteling, or a personal styling subscription. |

## First five engineering tickets to open

1. **Define the commerce domain model and API contract** for products, variants, inventory, carts, checkout quotes, orders, payments, fulfilments, delivery events, notifications, and returns.
2. **Integrate the payment provider server-side** with verified webhooks and idempotent order/payment transitions; connect the existing payment handoff interface to the resulting session contract.
3. **Implement product, SKU, and inventory administration** with publication workflow and availability checks in cart and checkout.
4. **Implement fulfilment, carrier tracking, and transactional messaging** using the existing cached delivery hooks and customer preference controls.
5. **Run a launch-readiness quality pass** covering accessibility, error monitoring, audit logs, security controls, legal pages, SEO, performance budgets, and end-to-end test coverage.
