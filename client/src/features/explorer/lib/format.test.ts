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

  it("formats small fees without displaying a false zero", () => {
    const chainProperties = {
      tokenSymbol: "QF",
      tokenDecimals: 18,
    }

    expect(formatFee("100000000000", chainProperties)).toBe("<0.000001 QF")
    expect(formatFee("1000000000000", chainProperties)).toBe("0.000001 QF")
    expect(formatFee("1000000000000000000", chainProperties)).toBe("1 QF")
  })

  it("keeps readable precision for non-zero fees above the threshold", () => {
    const chainProperties = {
      tokenSymbol: "QF",
      tokenDecimals: 18,
    }

    expect(formatFee("123456000000000000", chainProperties)).toBe("0.123 QF")
    expect(formatFee("1234560000000000", chainProperties)).toBe("0.00123 QF")
    expect(formatFee("1234560000000", chainProperties)).toBe("0.00000123 QF")
    expect(formatFee("1234560000000000000", chainProperties)).toBe("1.235 QF")
  })
})
