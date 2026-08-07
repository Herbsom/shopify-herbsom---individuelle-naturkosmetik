import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(
  resolve(process.cwd(), "client/src/pages/Home.tsx"),
  "utf8"
);

describe("mobile product overview", () => {
  it("uses square uncropped product images on small screens", () => {
    expect(homeSource).toContain("aspect-square w-full overflow-hidden");
    expect(homeSource).toContain("object-contain md:object-cover");
    expect(homeSource).toContain('alt={product.name}');
  });
});
