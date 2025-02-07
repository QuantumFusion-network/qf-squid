module.exports = class Data1738924820331 {
    name = 'Data1738924820331'

    async up(db) {
        await db.query(`ALTER TABLE "transfer" ALTER COLUMN "fee" SET NOT NULL`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "transfer" ALTER COLUMN "fee" DROP NOT NULL`)
    }
}
