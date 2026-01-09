/**
 * Unit tests for src/utils/status.js.
 * Covers all branches for good branch coverage
 */
import { describe, it, expect } from "vitest";
import { formatStatus } from "../../src/utils/status.js";

describe("formatStatus", () => {
  // Test negative uptime
  it("throws on negative", () => {
    expect(() => formatStatus(-1)).toThrow("invalid uptime");
  });
  //test uptime below 60 seconds
  it("warming-up under 60s", () => {
    expect(formatStatus(10)).toBe("warming-up");
  });
  // Test uptime below one hour
  it("healthy under 1h", () => {
    // the application has been running for a long time
    expect(formatStatus(3599)).toBe("healthy");
  });
  it("steady at or after 1h", () => {
    expect(formatStatus(3600)).toBe("steady");
  });
});
