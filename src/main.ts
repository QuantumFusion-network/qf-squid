import {TypeormDatabase, Store} from '@subsquid/typeorm-store'
import {In} from 'typeorm'
import * as ss58 from '@subsquid/ss58'
import assert from 'assert'

import {processor, ProcessorContext} from './processor'
import {Account, Transfer, ProgramBlobUploaded, Calculated} from './model'
import {events} from './types'

processor.run(new TypeormDatabase({supportHotBlocks: true}), async (ctx) => {
    let [
        transferEvents,
        programBlobUploadedEvents,
        calculatedEvents,
    ]: [TransferEvent[], ProgramBlobUploadedEvent[], CalculatedEvent[]] = getEvents(ctx)

    let accounts: Map<string, Account> = await createAccounts(
        ctx,
        transferEvents,
        programBlobUploadedEvents,
        calculatedEvents,
    )
    let transfers: Transfer[] = createTransfers(transferEvents, accounts)
    let uploads: ProgramBlobUploaded[] = createProgramBlobUploads(programBlobUploadedEvents, accounts)
    let calculations: Calculated[] = createCalculations(calculatedEvents, accounts)

    await ctx.store.upsert([...accounts.values()])
    await ctx.store.insert(transfers)
    await ctx.store.insert(uploads)
    await ctx.store.insert(calculations)
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

interface ProgramBlobUploadedEvent {
    id: string
    blockNumber: number
    timestamp: Date
    extrinsicHash?: string
    who: string
    address: string
    exports: string[]
    fee?: bigint
}

interface CalculatedEvent {
    id: string
    blockNumber: number
    timestamp: Date
    extrinsicHash?: string
    who: string
    address: string
    result: number
    fee?: bigint
}

function getEvents(ctx: ProcessorContext<Store>): [TransferEvent[], ProgramBlobUploadedEvent[], CalculatedEvent[]] {
    // Filters and decodes the arriving events
    let transfers: TransferEvent[] = []
    let uploads: ProgramBlobUploadedEvent[] = []
    let calculations: CalculatedEvent[] = []
    for (let block of ctx.blocks) {
        for (let event of block.events) {
            if (event.name == events.balances.transfer.name) {
                let rec: {from: string; to: string; amount: bigint}
                if (events.balances.transfer.v100.is(event)) {
                    rec = events.balances.transfer.v100.decode(event)
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

            else if (event.name == events.qfPolkaVm.programBlobUploaded.name) {
                let rec: {who: string; address: string; exports: string[]}
                if (events.qfPolkaVm.programBlobUploaded.v100.is(event)) {
                    rec = events.qfPolkaVm.programBlobUploaded.v100.decode(event)
                }
                else {
                    throw new Error('Unsupported spec')
                }

                assert(block.header.timestamp, `Got an undefined timestamp at block ${block.header.height}`)

                uploads.push({
                    id: event.id,
                    blockNumber: block.header.height,
                    timestamp: new Date(block.header.timestamp),
                    extrinsicHash: event.extrinsic?.hash,
                    who: ss58.codec('substrate').encode(rec.who),
                    address: rec.address,
                    exports: rec.exports,
                    fee: event.extrinsic?.fee || 0n,
                })
            }

            else if (event.name == events.qfPolkaVm.calculated.name) {
                let rec: {who: string; address: string; result: number}
                if (events.qfPolkaVm.calculated.v100.is(event)) {
                    rec = events.qfPolkaVm.calculated.v100.decode(event)
                }
                else {
                    throw new Error('Unsupported spec')
                }

                assert(block.header.timestamp, `Got an undefined timestamp at block ${block.header.height}`)

                calculations.push({
                    id: event.id,
                    blockNumber: block.header.height,
                    timestamp: new Date(block.header.timestamp),
                    extrinsicHash: event.extrinsic?.hash,
                    who: ss58.codec('substrate').encode(rec.who),
                    address: rec.address,
                    result: rec.result,
                    fee: event.extrinsic?.fee || 0n,
                })
            }

        }
    }
    return [transfers, uploads, calculations]
}

async function createAccounts(
    ctx: ProcessorContext<Store>,
    transferEvents: TransferEvent[],
    programBlobUploadedEvents: ProgramBlobUploadedEvent[],
    calculatedEvents: CalculatedEvent[],
): Promise<Map<string,Account>> {
    const accountIds = new Set<string>()
    for (let e of transferEvents) {
        accountIds.add(e.from)
        accountIds.add(e.to)
    }
    for (let e of programBlobUploadedEvents) {
        accountIds.add(e.who)
    }
    for (let e of calculatedEvents) {
        accountIds.add(e.who)
    }

    const accounts = await ctx.store.findBy(Account, {id: In([...accountIds])}).then((accounts) => {
        return new Map(accounts.map((a) => [a.id, a]))
    })

    for (let t of transferEvents) {
        updateAccounts(t.from)
        updateAccounts(t.to)
    }
    for (let t of programBlobUploadedEvents) {
        updateAccounts(t.who)
    }
    for (let t of calculatedEvents) {
        updateAccounts(t.who)
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

function createProgramBlobUploads(events: ProgramBlobUploadedEvent[], accounts: Map<string, Account>): ProgramBlobUploaded[] {
    let records: ProgramBlobUploaded[] = []
    for (let e of events) {
        let {id, blockNumber, timestamp, extrinsicHash, address, exports, fee} = e
        let who = accounts.get(e.who)
        records.push(new ProgramBlobUploaded({
            id,
            blockNumber,
            timestamp,
            extrinsicHash,
            who,
            address,
            exports: exports.map((h) => Buffer.from(h.split('x')[1], 'hex').toString()).toString(),
            fee,
        }))
    }
    return records
}

function createCalculations(events: CalculatedEvent[], accounts: Map<string, Account>): Calculated[] {
    let records: Calculated[] = []
    for (let e of events) {
        let {id, blockNumber, timestamp, extrinsicHash, address, result, fee} = e
        let who = accounts.get(e.who)
        records.push(new Calculated({
            id,
            blockNumber,
            timestamp,
            extrinsicHash,
            who,
            address,
            result: BigInt(result),
            fee,
        }))
    }
    return records
}
