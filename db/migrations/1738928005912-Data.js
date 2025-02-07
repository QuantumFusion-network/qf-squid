module.exports = class Data1738928005912 {
    name = 'Data1738928005912'

    async up(db) {
        await db.query(`CREATE TABLE "program_blob_uploaded" ("id" character varying NOT NULL, "block_number" integer NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "extrinsic_hash" text, "address" text NOT NULL, "exports" text NOT NULL, "fee" numeric NOT NULL, "who_id" character varying, CONSTRAINT "PK_37d13dda226ba52117e0eafc643" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_7f9329e1f0d7ac275c6ac586c5" ON "program_blob_uploaded" ("block_number") `)
        await db.query(`CREATE INDEX "IDX_0f58c2f5e6ab600fff8bfe6529" ON "program_blob_uploaded" ("timestamp") `)
        await db.query(`CREATE INDEX "IDX_d20318bfe643bef2eb87d9ab99" ON "program_blob_uploaded" ("extrinsic_hash") `)
        await db.query(`CREATE INDEX "IDX_c8450282eb12ebebef9354cafc" ON "program_blob_uploaded" ("who_id") `)
        await db.query(`CREATE INDEX "IDX_c7905249a4672480461934f22b" ON "program_blob_uploaded" ("address") `)
        await db.query(`CREATE TABLE "calculated" ("id" character varying NOT NULL, "block_number" integer NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "extrinsic_hash" text, "address" text NOT NULL, "result" numeric NOT NULL, "fee" numeric NOT NULL, "who_id" character varying, CONSTRAINT "PK_f5ec3727eb47caa1d534a7826c5" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_e97cd6b7739d6ca5505bdfd377" ON "calculated" ("block_number") `)
        await db.query(`CREATE INDEX "IDX_2a03960ca7808434355c417057" ON "calculated" ("timestamp") `)
        await db.query(`CREATE INDEX "IDX_87ed515cce98e30df1f9a7e1fe" ON "calculated" ("extrinsic_hash") `)
        await db.query(`CREATE INDEX "IDX_620579b9594f31542ced20167b" ON "calculated" ("who_id") `)
        await db.query(`CREATE INDEX "IDX_ab997cbe4b3487793bd558bc47" ON "calculated" ("address") `)
        await db.query(`ALTER TABLE "transfer" ALTER COLUMN "fee" SET NOT NULL`)
        await db.query(`ALTER TABLE "program_blob_uploaded" ADD CONSTRAINT "FK_c8450282eb12ebebef9354cafc2" FOREIGN KEY ("who_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "calculated" ADD CONSTRAINT "FK_620579b9594f31542ced20167bf" FOREIGN KEY ("who_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "program_blob_uploaded"`)
        await db.query(`DROP INDEX "public"."IDX_7f9329e1f0d7ac275c6ac586c5"`)
        await db.query(`DROP INDEX "public"."IDX_0f58c2f5e6ab600fff8bfe6529"`)
        await db.query(`DROP INDEX "public"."IDX_d20318bfe643bef2eb87d9ab99"`)
        await db.query(`DROP INDEX "public"."IDX_c8450282eb12ebebef9354cafc"`)
        await db.query(`DROP INDEX "public"."IDX_c7905249a4672480461934f22b"`)
        await db.query(`DROP TABLE "calculated"`)
        await db.query(`DROP INDEX "public"."IDX_e97cd6b7739d6ca5505bdfd377"`)
        await db.query(`DROP INDEX "public"."IDX_2a03960ca7808434355c417057"`)
        await db.query(`DROP INDEX "public"."IDX_87ed515cce98e30df1f9a7e1fe"`)
        await db.query(`DROP INDEX "public"."IDX_620579b9594f31542ced20167b"`)
        await db.query(`DROP INDEX "public"."IDX_ab997cbe4b3487793bd558bc47"`)
        await db.query(`ALTER TABLE "transfer" ALTER COLUMN "fee" DROP NOT NULL`)
        await db.query(`ALTER TABLE "program_blob_uploaded" DROP CONSTRAINT "FK_c8450282eb12ebebef9354cafc2"`)
        await db.query(`ALTER TABLE "calculated" DROP CONSTRAINT "FK_620579b9594f31542ced20167bf"`)
    }
}
