import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v117 from '../v117'

export const transfer =  {
    name: 'Balances.Transfer',
    /**
     * Transfer succeeded.
     */
    v117: new EventType(
        'Balances.Transfer',
        sts.struct({
            from: v117.AccountId32,
            to: v117.AccountId32,
            amount: sts.bigint(),
        })
    ),
}
