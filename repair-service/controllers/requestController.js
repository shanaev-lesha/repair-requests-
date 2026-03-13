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