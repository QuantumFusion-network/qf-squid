import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v100 from '../v100'

export const transfer =  {
    name: 'Balances.Transfer',
    /**
     * Transfer succeeded.
     */
    v100: new EventType(
        'Balances.Transfer',
        sts.struct({
            from: v100.AccountId32,
            to: v100.AccountId32,
            amount: sts.bigint(),
        })
    ),
}
