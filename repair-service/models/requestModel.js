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

export const getRequestsByMaster = (masterId) => {
    return db("requests")
        .where({ assignedTo: masterId })
}


export const startRequest = async (id) => {

    const updated = await db("requests")
        .where({
            id,
            status: "assigned"
        })
        .update({
            status: "in_progress"
        })

    return updated
}


export const finishRequest = async (id) => {

    const updated = await db("requests")
        .where({
            id,
            status: "in_progress"
        })
        .update({
            status: "done"
        })

    return updated
}

export const getRequests = (status) => {

    const query = db("requests")

    if (status) {
        query.where({ status })
    }

    return query.orderBy("created_at", "desc")
}


export const assignRequest = async (id, masterId) => {

    const updated = await db("requests")
        .where({
            id,
            status: "new"
        })
        .update({
            assignedTo: masterId,
            status: "assigned",
            updated_at: new Date()
        })

    return updated
}


export const cancelRequest = async (id) => {

    const updated = await db("requests")
        .whereNot({
            status: "done"
        })
        .where({ id })
        .update({
            status: "canceled",
            updated_at: new Date()
        })

    return updated
}