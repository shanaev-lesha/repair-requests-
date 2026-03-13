import request from "supertest";
import app from "../app.js";

describe("Requests API", () => {
    it("should create a new request", async () => {
        const res = await request(app)
            .post("/requests")
            .send({
                clientName: "Test Client",
                phone: "555000111",
                address: "Test Street",
                problemText: "Test problem"
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.clientName).toBe("Test Client");
    });
});
