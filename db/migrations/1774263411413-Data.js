module.exports = class Data1774263411413 {
    name = 'Data1774263411413'

    async up(db) {
        await db.query(`CREATE TABLE "claim" ("id" character varying NOT NULL, "block_number" integer NOT NULL, "extrinsic_hash" text, "ethereum_account" text NOT NULL, "amount" numeric NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "who_id" character varying, CONSTRAINT "PK_466b305cc2e591047fa1ce58f81" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_24528e3c38f12c28bf002e9c18" ON "claim" ("block_number") `)
        await db.query(`CREATE INDEX "IDX_5a8fd5db91cbe8d19a8fd19345" ON "claim" ("extrinsic_hash") `)
        await db.query(`CREATE INDEX "IDX_70e9398b05040721d4e3815962" ON "claim" ("who_id") `)
        await db.query(`CREATE INDEX "IDX_2c0dab7290c8d45a105d833e24" ON "claim" ("ethereum_account") `)
        await db.query(`CREATE INDEX "IDX_452564988f61bb17eaf1299e5e" ON "claim" ("timestamp") `)
        await db.query(`CREATE TABLE "claim_creation" ("id" character varying NOT NULL, "block_number" integer NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "extrinsic_hash" text, "ethereum_account" text NOT NULL, "value" numeric NOT NULL, "vesting_start" numeric, "vesting_period" numeric, "vesting_per_period" numeric, "statement" text, "origin_account_id" character varying, CONSTRAINT "PK_c24b49d6ca9eaca9a37f09d026e" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_ef0e612e53c51d470a5baf24ac" ON "claim_creation" ("block_number") `)
        await db.query(`CREATE INDEX "IDX_9120ee1c0e97c7a7770747f930" ON "claim_creation" ("timestamp") `)
        await db.query(`CREATE INDEX "IDX_59fda3ffb4c5e0a98042452875" ON "claim_creation" ("extrinsic_hash") `)
        await db.query(`CREATE INDEX "IDX_b0ade359ae0197ab466ed0286c" ON "claim_creation" ("origin_account_id") `)
        await db.query(`CREATE INDEX "IDX_6cf0fafa7528f1110222ced030" ON "claim_creation" ("ethereum_account") `)
        await db.query(`CREATE INDEX "IDX_93a168579b98c46bb25df2274e" ON "claim_creation" ("statement") `)
        await db.query(`ALTER TABLE "extrinsic" ALTER COLUMN "hash" SET NOT NULL`)
        await db.query(`ALTER TABLE "claim" ADD CONSTRAINT "FK_70e9398b05040721d4e38159624" FOREIGN KEY ("who_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "claim_creation" ADD CONSTRAINT "FK_b0ade359ae0197ab466ed0286c8" FOREIGN KEY ("origin_account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "claim"`)
        await db.query(`DROP INDEX "public"."IDX_24528e3c38f12c28bf002e9c18"`)
        await db.query(`DROP INDEX "public"."IDX_5a8fd5db91cbe8d19a8fd19345"`)
        await db.query(`DROP INDEX "public"."IDX_70e9398b05040721d4e3815962"`)
        await db.query(`DROP INDEX "public"."IDX_2c0dab7290c8d45a105d833e24"`)
        await db.query(`DROP INDEX "public"."IDX_452564988f61bb17eaf1299e5e"`)
        await db.query(`DROP TABLE "claim_creation"`)
        await db.query(`DROP INDEX "public"."IDX_ef0e612e53c51d470a5baf24ac"`)
        await db.query(`DROP INDEX "public"."IDX_9120ee1c0e97c7a7770747f930"`)
        await db.query(`DROP INDEX "public"."IDX_59fda3ffb4c5e0a98042452875"`)
        await db.query(`DROP INDEX "public"."IDX_b0ade359ae0197ab466ed0286c"`)
        await db.query(`DROP INDEX "public"."IDX_6cf0fafa7528f1110222ced030"`)
        await db.query(`DROP INDEX "public"."IDX_93a168579b98c46bb25df2274e"`)
        await db.query(`ALTER TABLE "extrinsic" ALTER COLUMN "hash" DROP NOT NULL`)
        await db.query(`ALTER TABLE "claim" DROP CONSTRAINT "FK_70e9398b05040721d4e38159624"`)
        await db.query(`ALTER TABLE "claim_creation" DROP CONSTRAINT "FK_b0ade359ae0197ab466ed0286c8"`)
    }
}
