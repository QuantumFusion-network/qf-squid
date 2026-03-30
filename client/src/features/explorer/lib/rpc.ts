import { appEnv } from "@/features/explorer/lib/env"
import { computeSecureFinality } from "@/features/explorer/lib/finality"
import { loadMockChainProperties, loadMockSecureFinality } from "@/features/explorer/lib/mock-data"
import { DEFAULT_CHAIN_PROPERTIES } from "@/features/explorer/lib/types"
import type { ChainProperties, SecureFinalityResult } from "@/features/explorer/lib/types"

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

function getFirstArrayValue<T>(value: T | T[] | undefined | null): T | undefined {
  if (Array.isArray(value)) return value[0]
  return value ?? undefined
}

export async function loadChainProperties(): Promise<ChainProperties> {
  if (appEnv.useMock) {
    return loadMockChainProperties()
  }

  const api = await getApi()
  const properties = await api.rpc.system.properties()
  const json = typeof properties.toJSON === "function" ? properties.toJSON() : properties

  const tokenSymbol =
    getFirstArrayValue(json?.tokenSymbol) ??
    api.registry.chainTokens?.[0] ??
    DEFAULT_CHAIN_PROPERTIES.tokenSymbol

  const tokenDecimals =
    Number(getFirstArrayValue(json?.tokenDecimals) ?? api.registry.chainDecimals?.[0] ?? DEFAULT_CHAIN_PROPERTIES.tokenDecimals)

  return {
    tokenSymbol: String(tokenSymbol),
    tokenDecimals: Number.isNaN(tokenDecimals) ? DEFAULT_CHAIN_PROPERTIES.tokenDecimals : tokenDecimals,
  }
}

export async function loadSecureFinality(blockNumber: number): Promise<SecureFinalityResult> {
  if (appEnv.useMock) {
    return loadMockSecureFinality(blockNumber)
  }

  const api = await getApi()
  const secureUpToQuery = api.query?.spinAnchoring?.secureUpTo
  const bestHeader = await api.rpc.chain.getHeader()
  const bestBlock = Number(bestHeader.number.toString())

  if (!secureUpToQuery) {
    return computeSecureFinality(blockNumber, null, bestBlock)
  }

  const secureUpToValue = await secureUpToQuery()
  const secureUpTo = Number(secureUpToValue.toString())

  return computeSecureFinality(blockNumber, secureUpTo, bestBlock)
}
