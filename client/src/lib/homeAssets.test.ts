import { describe, expect, it } from "vitest";
import { HOME_IMAGES } from "./homeAssets";

describe("HOME_IMAGES", () => {
  it("uses project-hosted assets for the shared-task ritual and texture images", () => {
    expect(HOME_IMAGES.ritual).toBe("/manus-storage/shared-task-ritual_0fdefbb5.jpg");
    expect(HOME_IMAGES.texture).toBe("/manus-storage/shared-task-texture_55eb63e2.jpg");
  });

  it("keeps every home image on an absolute project asset path", () => {
    expect(Object.values(HOME_IMAGES).every((source) => source.startsWith("/manus-storage/"))).toBe(true);
  });
});
