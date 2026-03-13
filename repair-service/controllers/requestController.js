import * as requestModel from "../models/requestModel.js"

export const createRequest = async (req, res) => {
    try {

        const { clientName, phone, address, problemText } = req.body

        if (!clientName || !phone || !address || !problemText) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        const request = await requestModel.createRequest({
            clientName,
            phone,
            address,
            problemText
        })

        res.status(201).json(request)

    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
}

export const getMyRequests = async (req, res) => {

    const masterId = req.user.id

    const requests = await requestModel.getRequestsByMaster(masterId)

    res.json(requests)
}


export const startRequest = async (req, res) => {

    const id = req.params.id

    const updated = await requestModel.startRequest(id)

    if (!updated) {
        return res.status(409).json({
            message: "Request already taken"
        })
    }

    res.json({ message: "Request started" })
}


export const finishRequest = async (req, res) => {

    const id = req.params.id

    const updated = await requestModel.finishRequest(id)

    if (!updated) {
        return res.status(400).json({
            message: "Request cannot be finished"
        })
    }

    res.json({ message: "Request finished" })
}