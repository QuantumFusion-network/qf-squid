export type SearchKind = "hash" | "id"

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

export type SecureFinalityState = "secure" | "pending" | "unavailable"

export interface SecureFinalityResult {
  state: SecureFinalityState
  blockNumber: number
  secureUpTo?: number
}
