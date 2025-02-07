import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v100 from '../v100'

export const calculated =  {
    name: 'QFPolkaVM.Calculated',
    /**
     * A user has successfully set a new value.
     */
    v100: new EventType(
        'QFPolkaVM.Calculated',
        sts.struct({
            /**
             * The account who set the new value.
             */
            who: v100.AccountId32,
            address: v100.H256,
            /**
             * The new value set.
             */
            result: sts.number(),
        })
    ),
}

export const programBlobUploaded =  {
    name: 'QFPolkaVM.ProgramBlobUploaded',
    v100: new EventType(
        'QFPolkaVM.ProgramBlobUploaded',
        sts.struct({
            /**
             * The account who uploaded ProgramBlob.
             */
            who: v100.AccountId32,
            address: v100.H256,
            exports: sts.array(() => sts.bytes()),
        })
    ),
}
