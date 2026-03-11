export async function seed(knex) {

  await knex("requests").del()

  await knex("requests").insert([
    {
      clientName: "Ivan Petrov",
      phone: "555111222",
      address: "Tbilisi, Vazisubani",
      problemText: "Не работает розетка",
      status: "new",
      assignedTo: null
    },
    {
      clientName: "Anna Ivanova",
      phone: "555222333",
      address: "Tbilisi, Saburtalo",
      problemText: "Протекает кран",
      status: "assigned",
      assignedTo: 2
    },
    {
      clientName: "Sergey Smirnov",
      phone: "555333444",
      address: "Tbilisi, Vake",
      problemText: "Не включается свет",
      status: "in_progress",
      assignedTo: 2
    },
    {
      clientName: "Maria Sokolova",
      phone: "555444555",
      address: "Tbilisi, Gldani",
      problemText: "Сломан выключатель",
      status: "done",
      assignedTo: 3
    },
    {
      clientName: "Alex Ivanov",
      phone: "555555666",
      address: "Tbilisi, Didube",
      problemText: "Не работает бойлер",
      status: "canceled",
      assignedTo: null
    }
  ])
}