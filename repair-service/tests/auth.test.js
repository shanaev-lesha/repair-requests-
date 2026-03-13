import request from "supertest";
import app from "../app.js";

describe("Auth API", () => {
    it("should return JWT token for valid user", async () => {
        const res = await request(app)
            .post("/auth/login")
            .send({
                name: "dispatcher",
                password: "1234"
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.token).toBeDefined();
    });
});
