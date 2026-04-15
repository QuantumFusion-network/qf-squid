import { GraphQLClient } from "graphql-request"

import { appEnv } from "@/features/explorer/lib/env"
import type { ExplorerDetail, ExtrinsicSummary, TransferItem } from "@/features/explorer/lib/types"

function getClient() {
  const endpoint = appEnv.graphqlEndpoint.trim()

  if (!endpoint) {
    throw new Error("Missing VITE_GRAPHQL_ENDPOINT for live explorer requests")
  }

  return new GraphQLClient(endpoint)
}

const EXTRINSIC_FIELDS = `
  id
  hash
  blockHash
  blockNumber
  index
  success
  version
`

const TRANSFER_FIELDS = `
  id
  blockNumber
  timestamp
  extrinsicHash
  amount
  fee
  from { id }
  to { id }
`

function normalizeExtrinsic(data: ExtrinsicSummary): ExtrinsicSummary {
  return {
    ...data,
    blockNumber: Number(data.blockNumber),
    index: Number(data.index),
    version: Number(data.version),
  }
}

function normalizeTransfer(data: TransferItem): TransferItem {
  return {
    ...data,
    blockNumber: Number(data.blockNumber),
  }
}

export async function loadExplorerDetailByHash(hash: string): Promise<ExplorerDetail | null> {
  const client = getClient()
  const response = await client.request<{
    extrinsics: ExtrinsicSummary[]
    transfers: TransferItem[]
  }>(
    `query TransferDetailByHash($hash: String!) {
      extrinsics(where: { hash_eq: $hash }, limit: 1) {
        ${EXTRINSIC_FIELDS}
      }
      transfers(where: { extrinsicHash_eq: $hash }) {
        ${TRANSFER_FIELDS}
      }
    }`,
    { hash }
  )

  if (response.extrinsics.length === 0 || response.transfers.length === 0) {
    return null
  }

  return {
    kind: "hash",
    query: hash,
    extrinsic: normalizeExtrinsic(response.extrinsics[0]),
    transfers: response.transfers.map(normalizeTransfer),
  }
}

export async function loadExplorerDetailById(id: string): Promise<ExplorerDetail | null> {
  const client = getClient()
  const extrinsicResponse = await client.request<{
    extrinsicById: ExtrinsicSummary | null
  }>(
    `query ExtrinsicLookupById($id: String!) {
      extrinsicById(id: $id) {
        ${EXTRINSIC_FIELDS}
      }
    }`,
    { id }
  )

  if (!extrinsicResponse.extrinsicById) {
    return null
  }

  const extrinsic = normalizeExtrinsic(extrinsicResponse.extrinsicById)
  const transferResponse = await client.request<{
    transfers: TransferItem[]
  }>(
    `query TransfersByHash($hash: String!) {
      transfers(where: { extrinsicHash_eq: $hash }) {
        ${TRANSFER_FIELDS}
      }
    }`,
    { hash: extrinsic.hash }
  )

  if (transferResponse.transfers.length === 0) {
    return null
  }

  return {
    kind: "id",
    query: id,
    extrinsic,
    transfers: transferResponse.transfers.map(normalizeTransfer),
  }
}
