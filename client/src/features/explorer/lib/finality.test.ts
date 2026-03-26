import { describe, expect, it } from "vitest"

import { computeSecureFinality } from "@/features/explorer/lib/finality"

describe("computeSecureFinality", () => {
  it("marks secure finality when block is anchored", () => {
    expect(computeSecureFinality(100, 120).state).toBe("secure")
  })

  it("marks pending when block is above secureUpTo", () => {
    expect(computeSecureFinality(250, 200).state).toBe("pending")
  })

  it("marks unavailable when secureUpTo is missing", () => {
    expect(computeSecureFinality(250, null).state).toBe("unavailable")
  })
})
