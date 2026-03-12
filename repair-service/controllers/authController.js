import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import db from "../db/knex.js"

export const login = async (req, res) => {
    const { name, password } = req.body

    const user = await db("users")
        .where({ name })
        .first()

    if (!user) {
        return res.status(401).json({ message: "User not found" })
    }

    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
        return res.status(401).json({ message: "Invalid password" })
    }

    const token = jwt.sign(
        {
            id: user.id,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: "8h" }
    )

    res.json({ token })
}