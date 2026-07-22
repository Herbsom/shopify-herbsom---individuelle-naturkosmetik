import { describe, expect, it } from "vitest";
import { HOME_IMAGES } from "../client/src/lib/homeAssets";

describe("HOME_IMAGES", () => {
  it("uses project-hosted assets for every image position of the reference layout", () => {
    expect(HOME_IMAGES.ingredients).toBe("/manus-storage/editorial-home-skincare_7e8e0204.jpg");
    expect(HOME_IMAGES.ritual).toBe("/manus-storage/shared-task-ritual_0fdefbb5.jpg");
    expect(HOME_IMAGES.texture).toBe("/manus-storage/shared-task-texture_55eb63e2.jpg");
    expect(HOME_IMAGES.products).toBe("/manus-storage/editorial-story-wide_14bfe783.jpg");
  });

  it("keeps every home image on an absolute project asset path", () => {
    expect(Object.values(HOME_IMAGES).every((source) => source.startsWith("/manus-storage/"))).toBe(true);
  });
});
