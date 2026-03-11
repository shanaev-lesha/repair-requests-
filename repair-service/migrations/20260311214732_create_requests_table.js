export async function up(knex) {
    await knex.schema.createTable("requests", (table) => {
        table.increments("id").primary()

        table.string("clientName").notNullable()
        table.string("phone").notNullable()
        table.string("address").notNullable()
        table.text("problemText").notNullable()

        table
            .enu("status", [
                "new",
                "assigned",
                "in_progress",
                "done",
                "canceled"
            ])
            .defaultTo("new")
            .notNullable()

        table
            .integer("assignedTo")
            .unsigned()
            .references("id")
            .inTable("users")
            .onDelete("SET NULL")

        table.timestamps(true, true)
    })
}

export async function down(knex) {
    await knex.schema.dropTableIfExists("requests")
}
