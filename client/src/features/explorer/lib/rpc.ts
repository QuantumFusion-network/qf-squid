import { appEnv } from "@/features/explorer/lib/env"
import { computeSecureFinality } from "@/features/explorer/lib/finality"
import { loadMockSecureFinality } from "@/features/explorer/lib/mock-data"
import type { SecureFinalityResult } from "@/features/explorer/lib/types"

let apiPromise: Promise<any> | undefined

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

export async function loadSecureFinality(blockNumber: number): Promise<SecureFinalityResult> {
  if (appEnv.useMock) {
    return loadMockSecureFinality(blockNumber)
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
