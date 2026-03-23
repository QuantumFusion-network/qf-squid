import {TypeormDatabase, Store} from '@subsquid/typeorm-store'
import {In} from 'typeorm'
import * as ss58 from '@subsquid/ss58'
import assert from 'assert'

import {Call, processor, ProcessorContext} from './processor'
import {Account, Claim, ClaimCreation, Extrinsic, Transfer} from './model'
import {calls, events} from './types'

processor.run(new TypeormDatabase({supportHotBlocks: true}), async (ctx) => {
    let transferEvents: TransferEvent[] = getTransferEvents(ctx)
    let claimCreationCalls: ClaimCreationCall[] = getClaimCreationCalls(ctx)
    let claimEvents: ClaimEvent[] = getClaimEvents(ctx)
    let blockExtrinsics: BlockExtrinsic[] = getExtrinsics(ctx)

    let accounts: Map<string, Account> = await createAccounts(ctx, transferEvents, claimCreationCalls, claimEvents)
    let transfers: Transfer[] = createTransfers(transferEvents, accounts)
    let claimCreations: ClaimCreation[] = createClaimCreations(claimCreationCalls, accounts)
    let claims: Claim[] = createClaims(claimEvents, accounts)
    let extrinsics: Extrinsic[] = createExtrinsics(blockExtrinsics)

    await ctx.store.upsert([...accounts.values()])
    await ctx.store.insert(transfers)
    await ctx.store.insert(claimCreations)
    await ctx.store.insert(claims)
    await ctx.store.insert(extrinsics)
})

interface TransferEvent {
    id: string
    blockNumber: number
    timestamp: Date
    extrinsicHash?: string
    from: string
    to: string
    amount: bigint
    fee?: bigint
}

interface BlockExtrinsic {
    id: string;
    blockHash: string;
    blockNumber: number;
    hash: string;
    index: number;
    success: boolean;
    version: number;
}

interface ClaimCreationCall {
    id: string
    blockNumber: number
    timestamp: Date
    extrinsicHash?: string
    originAccount?: string
    ethereumAccount: string
    value: bigint
    vestingStart?: bigint
    vestingPeriod?: bigint
    vestingPerPeriod?: bigint
    statement?: string
}

interface ClaimEvent {
    id: string
    blockNumber: number
    timestamp: Date
    extrinsicHash?: string
    who: string
    ethereumAccount: string
    amount: bigint
}

function getExtrinsics(ctx: ProcessorContext<Store>): BlockExtrinsic[] {
    const extrinsics: BlockExtrinsic[] = [];
    for (let block of ctx.blocks) {
        for (let extrinsic of block.extrinsics) {
            extrinsics.push({
                id: extrinsic.id,
                blockHash: block.header.hash,
                blockNumber: block.header.height,
                hash: extrinsic.hash || '',
                index: extrinsic.index,
                success: extrinsic.success || false,
                version: extrinsic.version,
            });
        }
    }
    return extrinsics;
}

function getTransferEvents(ctx: ProcessorContext<Store>): TransferEvent[] {
    // Filters and decodes the arriving events
    let transfers: TransferEvent[] = []
    for (let block of ctx.blocks) {
        for (let event of block.events) {
            if (event.name == events.balances.transfer.name) {
                let rec: {from: string; to: string; amount: bigint}
                if (events.balances.transfer.v117.is(event)) {
                    rec = events.balances.transfer.v117.decode(event)
                }
                else {
                    throw new Error('Unsupported spec')
                }

                assert(block.header.timestamp, `Got an undefined timestamp at block ${block.header.height}`)

                transfers.push({
                    id: event.id,
                    blockNumber: block.header.height,
                    timestamp: new Date(block.header.timestamp),
                    extrinsicHash: event.extrinsic?.hash,
                    from: ss58.codec('substrate').encode(rec.from),
                    to: ss58.codec('substrate').encode(rec.to),
                    amount: rec.amount,
                    fee: event.extrinsic?.fee || 0n,
                })
            }
        }
    }
    return transfers
}

function getClaimCreationCalls(ctx: ProcessorContext<Store>): ClaimCreationCall[] {
    let claims: ClaimCreationCall[] = []

    for (let block of ctx.blocks) {
        for (let call of block.calls) {
            if (call.name !== calls.claims.mintClaim.name) continue

            if (!calls.claims.mintClaim.v117.is(call)) {
                throw new Error(`Unsupported spec for ${calls.claims.mintClaim.name}`)
            }

            assert(block.header.timestamp, `Got an undefined timestamp at block ${block.header.height}`)

            let rec = calls.claims.mintClaim.v117.decode(call)
            let vestingSchedule = rec.vestingSchedule ?? undefined
            claims.push({
                id: call.id,
                blockNumber: block.header.height,
                timestamp: new Date(block.header.timestamp),
                extrinsicHash: call.extrinsic?.hash,
                originAccount: getSignedOriginAccount(call),
                ethereumAccount: toHex(rec.who),
                value: rec.value,
                vestingStart: vestingSchedule?.[0],
                vestingPeriod: vestingSchedule?.[1],
                vestingPerPeriod: vestingSchedule?.[2],
                statement: getStatementKind(rec.statement),
            })
        }
    }

    return claims
}

function getClaimEvents(ctx: ProcessorContext<Store>): ClaimEvent[] {
    let claims: ClaimEvent[] = []

    for (let block of ctx.blocks) {
        for (let event of block.events) {
            if (event.name !== events.claims.claimed.name) continue

            if (!events.claims.claimed.v117.is(event)) {
                throw new Error(`Unsupported spec for ${events.claims.claimed.name}`)
            }

            assert(block.header.timestamp, `Got an undefined timestamp at block ${block.header.height}`)

            let rec = events.claims.claimed.v117.decode(event)
            claims.push({
                id: event.id,
                blockNumber: block.header.height,
                timestamp: new Date(block.header.timestamp),
                extrinsicHash: event.extrinsic?.hash,
                who: ss58.codec('substrate').encode(rec.who),
                ethereumAccount: toHex(rec.ethereumAddress),
                amount: rec.amount,
            })
        }
    }

    return claims
}

async function createAccounts(
    ctx: ProcessorContext<Store>,
    transferEvents: TransferEvent[],
    claimCreationCalls: ClaimCreationCall[],
    claimEvents: ClaimEvent[],
): Promise<Map<string,Account>> {
    const accountIds = new Set<string>()
    for (let e of transferEvents) {
        accountIds.add(e.from)
        accountIds.add(e.to)
    }
    for (let c of claimCreationCalls) {
        if (c.originAccount != null) {
            accountIds.add(c.originAccount)
        }
    }
    for (let c of claimEvents) {
        accountIds.add(c.who)
    }

    const accounts = await ctx.store.findBy(Account, {id: In([...accountIds])}).then((accounts) => {
        return new Map(accounts.map((a) => [a.id, a]))
    })

    for (let t of transferEvents) {
        updateAccounts(t.from)
        updateAccounts(t.to)
    }
    for (let c of claimCreationCalls) {
        updateAccounts(c.originAccount)
    }
    for (let c of claimEvents) {
        updateAccounts(c.who)
    }

    function updateAccounts(id?: string): void {
        if (id == null) return
        const acc = accounts.get(id)
        if (acc == null) {
            accounts.set(id, new Account({id}))
        }
    }

    return accounts
}

function createTransfers(transferEvents: TransferEvent[], accounts: Map<string, Account>): Transfer[] {
    let transfers: Transfer[] = []
    for (let t of transferEvents) {
        let {id, blockNumber, timestamp, extrinsicHash, amount, fee} = t
        let from = accounts.get(t.from)
        let to = accounts.get(t.to)
        transfers.push(new Transfer({
            id,
            blockNumber,
            timestamp,
            extrinsicHash,
            from,
            to,
            amount,
            fee,
        }))
    }
    return transfers
}

function createClaimCreations(claimCreationCalls: ClaimCreationCall[], accounts: Map<string, Account>): ClaimCreation[] {
    let claims: ClaimCreation[] = []

    for (let c of claimCreationCalls) {
        claims.push(new ClaimCreation({
            id: c.id,
            blockNumber: c.blockNumber,
            timestamp: c.timestamp,
            extrinsicHash: c.extrinsicHash,
            originAccount: c.originAccount == null ? undefined : accounts.get(c.originAccount),
            ethereumAccount: c.ethereumAccount,
            value: c.value,
            vestingStart: c.vestingStart,
            vestingPeriod: c.vestingPeriod,
            vestingPerPeriod: c.vestingPerPeriod,
            statement: c.statement,
        }))
    }

    return claims
}

function createClaims(claimEvents: ClaimEvent[], accounts: Map<string, Account>): Claim[] {
    let claims: Claim[] = []

    for (let c of claimEvents) {
        let who = accounts.get(c.who)
        assert(who, `Missing account for claim event ${c.id}`)

        claims.push(new Claim({
            id: c.id,
            blockNumber: c.blockNumber,
            extrinsicHash: c.extrinsicHash,
            who,
            ethereumAccount: c.ethereumAccount,
            amount: c.amount,
            timestamp: c.timestamp,
        }))
    }

    return claims
}

function createExtrinsics(extrinsicEvents: BlockExtrinsic[]): Extrinsic[] {
    let extrinsics: Extrinsic[] = []
    for (let e of extrinsicEvents) {
        let {id, blockHash, blockNumber, hash, index, success, version} = e
        extrinsics.push(new Extrinsic({
            id,
            blockHash,
            blockNumber,
            hash,
            index,
            success,
            version,
        }))
    }
    return extrinsics
}

function getSignedOriginAccount(call: Call): string | undefined {
    let origin = call.origin
    if (
        origin != null &&
        typeof origin === 'object' &&
        origin.__kind === 'system' &&
        origin.value != null &&
        typeof origin.value === 'object' &&
        origin.value.__kind === 'Signed'
    ) {
        return ss58.codec('substrate').encode(origin.value.value)
    }

    return undefined
}

function getStatementKind(
    statement: {__kind: string} | undefined | null
): string | undefined {
    return statement?.__kind
}

function toHex(value: Uint8Array | number[] | string): string {
    if (typeof value === 'string') return value
    return '0x' + Buffer.from(value).toString('hex')
}
