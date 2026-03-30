import { describe, expect, it } from "vitest"

import { computeSecureFinality } from "@/features/explorer/lib/finality"

describe("computeSecureFinality", () => {
  it("marks confirmed when block is anchored", () => {
    expect(computeSecureFinality(100, 120, 140).state).toBe("confirmed")
  })

  it("marks pending when block is above secureUpTo", () => {
    const result = computeSecureFinality(250, 200, 255)

    expect(result.state).toBe("pending")
    expect(result.confirmations).toBe(5)
  })

  it("marks unavailable when secureUpTo is missing", () => {
    expect(computeSecureFinality(250, null, 252).state).toBe("unavailable")
  })
})
