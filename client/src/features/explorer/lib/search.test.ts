import { describe, expect, it } from "vitest"

import { detectSearchKind } from "@/features/explorer/lib/search"

describe("detectSearchKind", () => {
  it("detects hash input", () => {
    expect(detectSearchKind("0xabc123")).toBe("hash")
  })

  it("treats non-hash as id", () => {
    expect(detectSearchKind("0048833571-94a1a-000001")).toBe("id")
  })
})
