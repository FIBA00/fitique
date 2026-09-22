# Fitique Frontend Delivery Sequence

## Scope boundary

This delivery sequence completes the **client experience** before live commerce, fulfilment, and messaging services are connected. Each feature will use local, deterministic fallback states and the existing cached service seams; no real payment, carrier, stock, or customer-message action will be performed in the browser.

| Step | Build first | Why it comes first | Backend handoff later |
|---|---|---|---|
| 1 | Product decision support | Improves the browse-to-bag decision before adding more post-purchase surfaces. | Product variants, stock, size-chart, care, and related-product endpoints. |
| 2 | Bag and checkout support | Makes the conversion flow complete and validates promotions, delivery choices, and order notes in the interface. | Quote, promotion, tax, and checkout-session endpoints. |
| 3 | Returns, exchanges, and fit feedback | Completes the customer promise after delivery and captures UI/data contracts for service operations. | Orders, return labels, exchange inventory, refunds, and feedback APIs. |
| 4 | Preferences, alerts, and saved discovery | Creates retention and customer-control surfaces using local persistence and cache-ready hooks. | Wishlist, saved-search, notification-preference, and alert endpoints. |
| 5 | Help, trust, and policy pages | Provides the information and support paths required for a credible public launch. | CMS/help-centre and support-ticket endpoints, if later needed. |
| 6 | Accessibility, performance, and integration polish | Ensures the frontend remains easy to use and straightforward for backend integration. | Monitoring, feature flags, image CDN, and server headers. |
| 7 | Journey validation | Exercises the full frontend flow with local data and documents acceptance criteria. | Run again against staging providers once integrations exist. |

> **Completion rule:** the frontend is complete when every visible path has an intentional loading, empty, populated, error, and offline-safe state—even where the real data source has not yet been attached.
