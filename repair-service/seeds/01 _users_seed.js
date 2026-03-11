export async function seed(knex) {
  await knex("users").del()

  await knex("users").insert([
    { id: 1, name: "Dispatcher", role: "dispatcher" },
    { id: 2, name: "Master Ivan", role: "master" },
    { id: 3, name: "Master Alex", role: "master" }
  ])
}
