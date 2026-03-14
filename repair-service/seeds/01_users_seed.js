import bcrypt from "bcrypt"

export async function seed(knex) {

  await knex("users").del()

  const password = await bcrypt.hash("1234", 10)

  await knex("users").insert([
    {
      id: 1,
      name: "dispatcher",
      role: "dispatcher",
      password
    },
    {
      id: 2,
      name: "master2",
      role: "master",
      password
    },
    {
      id: 3,
      name: "master3",
      role: "master",
      password
    }
  ])
}
