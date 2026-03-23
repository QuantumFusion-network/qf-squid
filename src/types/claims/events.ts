import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v117 from '../v117'

export const claimed =  {
    name: 'Claims.Claimed',
    /**
     * Someone claimed some DOTs.
     */
    v117: new EventType(
        'Claims.Claimed',
        sts.struct({
            who: v117.AccountId32,
            ethereumAddress: v117.EthereumAddress,
            amount: sts.bigint(),
        })
    ),
}
