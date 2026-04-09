import { appEnv } from "@/features/explorer/lib/env"
import { loadMockChainProperties } from "@/features/explorer/lib/mock-data"
import { DEFAULT_CHAIN_PROPERTIES } from "@/features/explorer/lib/types"
import type { ChainProperties } from "@/features/explorer/lib/types"

let apiPromise: Promise<any> | undefined

async function getApi() {
  const endpoint = appEnv.rpcEndpoint.trim()

  if (!endpoint) {
    throw new Error("Missing VITE_RPC_ENDPOINT for live chain property requests")
  }

  if (!apiPromise) {
    apiPromise = (async () => {
      const { ApiPromise, WsProvider } = await import("@polkadot/api")
      const provider = new WsProvider(endpoint)
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

  if (!appEnv.rpcEndpoint.trim()) {
    return DEFAULT_CHAIN_PROPERTIES
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
