export type SearchKind = "hash" | "id"

export interface ChainProperties {
  tokenSymbol: string
  tokenDecimals: number
}

export const DEFAULT_CHAIN_PROPERTIES: ChainProperties = {
  tokenSymbol: "QF",
  tokenDecimals: 18,
}

export interface AccountRef {
  id: string
}

export interface TransferItem {
  id: string
  blockNumber: number
  timestamp: string
  extrinsicHash: string | null
  amount: string
  fee: string
  from: AccountRef
  to: AccountRef
}

export interface ExtrinsicSummary {
  id: string
  hash: string
  blockHash: string
  blockNumber: number
  index: number
  success: boolean
  version: number
}

export interface ExplorerDetail {
  kind: SearchKind
  query: string
  extrinsic: ExtrinsicSummary
  transfers: TransferItem[]
}

export type SecureFinalityState = "confirmed" | "pending" | "unavailable"

export interface SecureFinalityResult {
  state: SecureFinalityState
  blockNumber: number
  secureUpTo?: number
  bestBlock?: number
  confirmations?: number
}
