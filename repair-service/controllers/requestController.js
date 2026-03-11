import { getAllRequests } from "../models/requestModel.js";

export const getRequests = async (req, res) => {
    const requests = await getAllRequests();
    res.json(requests);
};