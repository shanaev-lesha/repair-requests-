import db from "../db/knex.js";

export const getAllRequests = () => {
    return db("requests").select("*");
};
