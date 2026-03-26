import { appEnv } from "@/features/explorer/lib/env"
import { computeSecureFinality } from "@/features/explorer/lib/finality"
import { loadMockSecureFinality } from "@/features/explorer/lib/mock-data"
import type { SecureFinalityResult } from "@/features/explorer/lib/types"

let apiPromise: Promise<any> | undefined

interface FinalityProxyPayload {
  blockNumber?: number
  secureUpTo?: number | null
  state?: SecureFinalityResult["state"]
}

async function getApi() {
  if (!apiPromise) {
    apiPromise = (async () => {
      const { ApiPromise, WsProvider } = await import("@polkadot/api")
      const provider = new WsProvider(appEnv.rpcEndpoint)
      return ApiPromise.create({ provider })
    })()
  }

  return apiPromise
}

async function loadSecureFinalityFromProxy(blockNumber: number): Promise<SecureFinalityResult> {
  const url = new URL(appEnv.finalityProxyEndpoint)
  url.searchParams.set("blockNumber", String(blockNumber))

  const response = await fetch(url.toString())

  if (!response.ok) {
    throw new Error(`Finality proxy request failed with status ${response.status}`)
  }

  const payload = (await response.json()) as FinalityProxyPayload

  if (payload.state === "secure" || payload.state === "pending" || payload.state === "unavailable") {
    return {
      state: payload.state,
      blockNumber: payload.blockNumber ?? blockNumber,
      secureUpTo: payload.secureUpTo ?? undefined,
    }
  }

  return computeSecureFinality(blockNumber, payload.secureUpTo)
}

export async function loadSecureFinality(blockNumber: number): Promise<SecureFinalityResult> {
  if (appEnv.useMock) {
    return loadMockSecureFinality(blockNumber)
  }

  if (appEnv.finalityProxyEndpoint) {
    return loadSecureFinalityFromProxy(blockNumber)
  }

  const api = await getApi()
  const secureUpToQuery = api.query?.spinAnchoring?.secureUpTo

  if (!secureUpToQuery) {
    return computeSecureFinality(blockNumber, null)
  }

  const secureUpToValue = await secureUpToQuery()
  const secureUpTo = Number(secureUpToValue.toString())

  return computeSecureFinality(blockNumber, secureUpTo)
}
