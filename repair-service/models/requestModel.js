import db from "../db/knex.js"

export const createRequest = async (data) => {

    const [request] = await db("requests")
        .insert({
            clientName: data.clientName,
            phone: data.phone,
            address: data.address,
            problemText: data.problemText,
            status: "new"
        })
        .returning("*")

    return request
}