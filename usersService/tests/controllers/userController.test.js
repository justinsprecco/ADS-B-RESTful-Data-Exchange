const request = require("supertest")
const app = require("../../src/app")
const User = require("../../src/models/User")

// Mock user model
jest.mock("../../src/models/User")

beforeEach(() => 
{
   jest.clearAllMocks()
})

describe("POST /users", () => 
{
   it("should create a new user", async () => 
   {
      User.postUser.mockResolvedValue({ id: 1, username: "testUser", password: "password123" })

      const res = await request(app)
         .post("/users")
         .send({ username: "testUser", password: "password123" })

      expect(res.status).toBe(201)
      expect(res.body.message).toBe("User added with ID: 1")
   })

   it("should return an error if registration fails", async () => 
   {
      User.postUser.mockRejectedValue(new Error("Registration failed"))

      const res = await request(app)
         .post("/users")
         .send({ username: "invalidUser", password: "wrongPassword" })

      expect(res.status).toBe(500)
      expect(res.body.message).toMatch(/User registration failed/)
   })
})

