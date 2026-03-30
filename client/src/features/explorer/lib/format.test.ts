import { describe, expect, it } from "vitest"

import { formatAmount, formatFee } from "@/features/explorer/lib/format"

describe("format helpers", () => {
  it("formats values with provided chain properties", () => {
    const chainProperties = {
      tokenSymbol: "TST",
      tokenDecimals: 6,
    }

    expect(formatAmount("1234500", chainProperties)).toBe("1.2345 TST")
    expect(formatFee("250000", chainProperties)).toBe("0.25 TST")
  })
})
