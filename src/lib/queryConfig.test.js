import { describe, expect, it } from "vitest";
import { cachePolicy, queryClientDefaults, queryKeys } from "./queryConfig";

describe("Fitique query configuration", () => {
  it("keeps resource query keys isolated by resource and identifier", () => {
    expect(queryKeys.orders.detail("FTQ-10")).toEqual(["orders", "detail", "FTQ-10"]);
    expect(queryKeys.delivery.events("FTQ-10")).toEqual(["delivery", "events", "FTQ-10"]);
    expect(queryKeys.payment.handoff("FTQ-10")).not.toEqual(queryKeys.orders.detail("FTQ-10"));
  });

  it("uses longer cache lifetimes for catalogue data than live delivery events", () => {
    expect(cachePolicy.catalog.staleTime).toBeGreaterThan(cachePolicy.deliveryEvents.staleTime);
    expect(cachePolicy.categories.staleTime).toBeGreaterThan(cachePolicy.orders.staleTime);
    expect(queryClientDefaults.queries.refetchOnWindowFocus).toBe(false);
  });
});
