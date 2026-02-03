import {TypeormDatabase, Store} from '@subsquid/typeorm-store'
import {In} from 'typeorm'
import * as ss58 from '@subsquid/ss58'
import assert from 'assert'

import {processor, ProcessorContext} from './processor'
import {Account, Extrinsic, Transfer} from './model'
import {events} from './types'

processor.run(new TypeormDatabase({supportHotBlocks: true}), async (ctx) => {
    let transferEvents: TransferEvent[] = getTransferEvents(ctx)
    let blockExtrinsics: BlockExtrinsic[] = getExtrinsics(ctx);

    let accounts: Map<string, Account> = await createAccounts(ctx, transferEvents)
    let transfers: Transfer[] = createTransfers(transferEvents, accounts)
    let extrinsics: Extrinsic[] = createExtrinsics(blockExtrinsics, accounts)

    await ctx.store.upsert([...accounts.values()])
    await ctx.store.insert(transfers)
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

async function createAccounts(
    ctx: ProcessorContext<Store>,
    transferEvents: TransferEvent[],
): Promise<Map<string,Account>> {
    const accountIds = new Set<string>()
    for (let e of transferEvents) {
        accountIds.add(e.from)
        accountIds.add(e.to)
    }

    const accounts = await ctx.store.findBy(Account, {id: In([...accountIds])}).then((accounts) => {
        return new Map(accounts.map((a) => [a.id, a]))
    })

    for (let t of transferEvents) {
        updateAccounts(t.from)
        updateAccounts(t.to)
    }

    function updateAccounts(id: string): void {
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

function createExtrinsics(extrinsicEvents: BlockExtrinsic[], accounts: Map<string, Account>): Extrinsic[] {
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
