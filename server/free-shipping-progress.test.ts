import { describe, expect, it } from "vitest";
import {
  FREE_SHIPPING_THRESHOLD,
  getFreeShippingProgress,
} from "../client/src/components/FreeShippingProgress";

describe("free shipping progress", () => {
  it("uses a free-shipping threshold of 60 €", () => {
    expect(FREE_SHIPPING_THRESHOLD).toBe(60);
  });

  it("shows the remaining amount and a proportional progress below the threshold", () => {
    expect(getFreeShippingProgress(35)).toEqual({
      hasFreeShipping: false,
      remaining: 25,
      progress: 58,
    });
  });

  it("unlocks free shipping at and above the threshold", () => {
    expect(getFreeShippingProgress(60)).toEqual({
      hasFreeShipping: true,
      remaining: 0,
      progress: 100,
    });
    expect(getFreeShippingProgress(72)).toEqual({
      hasFreeShipping: true,
      remaining: 0,
      progress: 100,
    });
  });
});
