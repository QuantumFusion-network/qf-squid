import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support'
import * as v117 from '../v117'

export const mintClaim =  {
    name: 'Claims.mint_claim',
    /**
     * Mint a new claim to collect DOTs.
     * 
     * The dispatch origin for this call must be _Root_.
     * 
     * Parameters:
     * - `who`: The Ethereum address allowed to collect this claim.
     * - `value`: The number of DOTs that will be claimed.
     * - `vesting_schedule`: An optional vesting schedule for these DOTs.
     * 
     * <weight>
     * The weight of this call is invariant over the input parameters.
     * We assume worst case that both vesting and statement is being inserted.
     * 
     * Total Complexity: O(1)
     * </weight>
     */
    v117: new CallType(
        'Claims.mint_claim',
        sts.struct({
            who: v117.EthereumAddress,
            value: sts.bigint(),
            vestingSchedule: sts.option(() => sts.tuple(() => [sts.bigint(), sts.bigint(), sts.bigint()])),
            statement: sts.option(() => v117.StatementKind),
        })
    ),
}
