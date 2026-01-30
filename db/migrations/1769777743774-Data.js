module.exports = class Data1769777743774 {
    name = 'Data1769777743774'

    async up(db) {
        await db.query(`CREATE TABLE "extrinsic" ("id" character varying NOT NULL, "block_hash" text NOT NULL, "block_number" integer NOT NULL, "hash" text, "index" integer NOT NULL, "success" boolean NOT NULL, "version" integer NOT NULL, CONSTRAINT "PK_80d7db0e4b1e83e30336bc76755" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_579e39f71ef5f3b2a6839cd70b" ON "extrinsic" ("block_hash") `)
        await db.query(`CREATE INDEX "IDX_142f352835c698a35eacbeb2f5" ON "extrinsic" ("block_number") `)
        await db.query(`CREATE INDEX "IDX_1f45de0713a55049009e8e8127" ON "extrinsic" ("hash") `)
        await db.query(`CREATE INDEX "IDX_21e5db7671dfa1b00dbe6dbbd6" ON "extrinsic" ("success") `)
    }

    async down(db) {
        await db.query(`DROP TABLE "extrinsic"`)
        await db.query(`DROP INDEX "public"."IDX_579e39f71ef5f3b2a6839cd70b"`)
        await db.query(`DROP INDEX "public"."IDX_142f352835c698a35eacbeb2f5"`)
        await db.query(`DROP INDEX "public"."IDX_1f45de0713a55049009e8e8127"`)
        await db.query(`DROP INDEX "public"."IDX_21e5db7671dfa1b00dbe6dbbd6"`)
    }
}
