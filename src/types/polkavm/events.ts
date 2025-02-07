import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v1020 from '../v1020'
import * as v1050 from '../v1050'
import * as v9130 from '../v9130'

export const polkavm_blob_uploaded =  {
    name: 'qfPolkaVM.ProgramBlobUploaded',
    /**
     *  Transfer succeeded (from, to, value, fees).
     */
    v1020: new EventType(
        'qfPolkaVM.ProgramBlobUploaded',
        sts.tuple([v1020.AccountId, v1020.Hash, v1020.ByteString])
    ),
    /**
     *  Transfer succeeded (from, to, value).
     */
    v1050: new EventType(
        'qfPolkaVM.ProgramBlobUploaded',
        sts.tuple([v1050.AccountId, v1050.Hash, v1050.ByteString])
    ),
    /**
     * Transfer succeeded.
     */
    v9130: new EventType(
        'qfPolkaVM.ProgramBlobUploaded',
        sts.struct({
            who: v9130.AccountId32,
            address: v9130.Hash,
            exports: v9130.ByteString,
        })
    ),
}

export const polkavm_calculated =  {
    name: 'qfPolkaVM.Calculated',
    /**
     *  Transfer succeeded (from, to, value, fees).
     */
    v1020: new EventType(
        'qfPolkaVM.Calculated',
        sts.tuple([v1020.AccountId, v1020.Hash, v1020.CalculationResult])
    ),
    /**
     *  Transfer succeeded (from, to, value).
     */
    v1050: new EventType(
        'qfPolkaVM.Calculated',
        sts.tuple([v1050.AccountId, v1050.Hash, v1050.CalculationResult])
    ),
    /**
     * Transfer succeeded.
     */
    v9130: new EventType(
        'qfPolkaVM.Calculated',
        sts.struct({
            who: v9130.AccountId32,
            address: v9130.Hash,
            result: v9130.CalculationResult,
        })
    ),
}
