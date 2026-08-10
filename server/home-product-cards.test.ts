import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(
  resolve(process.cwd(), "client/src/pages/Home.tsx"),
  "utf8"
);

describe("product overview image presentation", () => {
  it("uses square uncropped product images on desktop and small screens", () => {
    expect(homeSource).toContain("aspect-square w-full overflow-hidden");
    expect(homeSource).toContain('className="h-full w-full object-contain"');
    expect(homeSource).not.toContain("md:aspect-auto md:h-72");
    expect(homeSource).not.toContain("md:object-cover");
    expect(homeSource).toContain('alt={product.name}');
  });
});
