import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
import {Transfer} from "./transfer.model"
import {Claim} from "./claim.model"
import {ClaimCreation} from "./claimCreation.model"

@Entity_()
export class Account {
    constructor(props?: Partial<Account>) {
        Object.assign(this, props)
    }

    /**
     * Account address
     */
    @PrimaryColumn_()
    id!: string

    @OneToMany_(() => Transfer, e => e.to)
    transfersTo!: Transfer[]

    @OneToMany_(() => Transfer, e => e.from)
    transfersFrom!: Transfer[]

    @OneToMany_(() => Claim, e => e.who)
    claims!: Claim[]

    @OneToMany_(() => ClaimCreation, e => e.originAccount)
    claimCreationsByOrigin!: ClaimCreation[]
}
