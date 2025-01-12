const request = require("supertest")
const app = require("../../src/app")
const User = require("../../src/models/User")

// Mock user model
jest.mock("../../src/models/User")
jest.mock('../../src/database/db', () => ({
   dbConnect: jest.fn(),
   dbDisconnect: jest.fn(),
}))

beforeEach(() =>
{
   jest.clearAllMocks()
})

describe("POST /users", () =>
{
   it("should create a new user", async () =>
   {
      User.create.mockResolvedValue({ _id: 1, username: "testUser", password: "password123" })

      const res = await request(app)
         .post("/users")
         .send({ username: "testUser", password: "password123" })

      expect(res.status).toBe(201)
      expect(res.body.message).toBe("User testUser created successfully with ID: 1")
   })

   it("should return an error if username already exists", async () =>
   {
      User.create.mockRejectedValue(new Error("Username already exists"))

      const res = await request(app)
         .post("/users")
         .send({ username: "existingUser", password: "password" })

      expect(res.status).toBe(500)
      expect(res.body.message).toMatch(/Error: User registration failed: Username already exists/)
   })
})

