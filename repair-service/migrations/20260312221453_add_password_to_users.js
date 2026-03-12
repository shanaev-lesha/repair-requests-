export async function up(knex) {
    await knex.schema.alterTable("users", (table) => {
        table.string("password").notNullable().defaultTo("123456")
    })
}

export async function down(knex) {
    await knex.schema.alterTable("users", (table) => {
        table.dropColumn("password")
    })
}
