import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, DateTimeColumn as DateTimeColumn_, StringColumn as StringColumn_, ManyToOne as ManyToOne_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"
import {Account} from "./account.model"

@Entity_()
export class ClaimCreation {
    constructor(props?: Partial<ClaimCreation>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @IntColumn_({nullable: false})
    blockNumber!: number

    @Index_()
    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @Index_()
    @StringColumn_({nullable: true})
    extrinsicHash!: string | undefined | null

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    originAccount!: Account | undefined | null

    @Index_()
    @StringColumn_({nullable: false})
    ethereumAccount!: string

    @BigIntColumn_({nullable: false})
    value!: bigint

    @BigIntColumn_({nullable: true})
    vestingStart!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    vestingPeriod!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    vestingPerPeriod!: bigint | undefined | null

    @Index_()
    @StringColumn_({nullable: true})
    statement!: string | undefined | null
}
