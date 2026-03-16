import { describe, expect, it } from "vitest";

import { formatNumber } from "../number-format";

describe("formatNumber", () => {
  it("formats number with Korean locale separators", () => {
    expect(formatNumber(1234567)).toBe("1,234,567");
  });
});
