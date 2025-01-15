const request = require("supertest")
const app = require("../../src/app")
const User = require("../../src/models/User")
const { verifyAccessToken } = require("../../src/middleware/authMiddleware")

jest.mock("morgan", () => jest.fn(() => (req, res, next) => next()))

// Mock user model
jest.mock("../../src/models/User")

jest.mock("../../src/middleware/authMiddleware", () => ({
   verifyAccessToken: jest.fn()
}))

jest.mock('../../src/database/db', () => ({
   dbConnect: jest.fn(),
   dbDisconnect: jest.fn(),
}))

beforeEach(() =>
{
   jest.clearAllMocks()
})

const userDevices = [
   { _id: 1, userId: 1, macAddress: "00:14:22:01:23:45", latitude: 25, longitude: 10 },
   { _id: 2, userId: 1, macAddress: "00:19:22:11:23:55", latitude: 55, longitude: 11 },
   { _id: 3, userId: 1, macAddress: "00:12:12:01:22:44", latitude: 33, longitude: 68 },
   { _id: 4, userId: 1, macAddress: "00:18:12:05:04:40", latitude: 89, longitude: 90 }
]

const existingUser =
{
   _id: 1,
   username: "user123",
   password: "password123",
   devices: userDevices
}

const updatedUser =
{
   _id: 1,
   username: "user213",
   password: "password213",
   devices: userDevices
}

const allUsers =
[
   { _id: 1, username: "user123", password: "password123", devices: userDevices },
   { _id: 2, username: "user321", password: "password123", devices: [{}] },
   { _id: 3, username: "user213", password: "password123", devices: [{}] }
]

describe("POST /users", () =>
{
   it("should create a new user", async () =>
   {
      User.create.mockResolvedValue({ user: existingUser })

      const res = await request(app)
         .post("/users")
         .send({ username: existingUser.username, password: existingUser.password })

      expect(res.status).toBe(201)
      expect(res.body.message).toBe(`User ${existingUser.username} created successfully with ID: ${existingUser._id}`)
   })

   it("should return an error if username already exists", async () =>
   {
      User.create.mockRejectedValue(new Error("Username already exists"))

      const res = await request(app)
         .post("/users")
         .send({ username: "existingUser", password: "password" })

      expect(res.status).toBe(409)
      expect(res.body.message).toMatch(/Username already exists/)
   })
})

describe("POST /users/validate", () =>
{
   it("should validate correct user information", async () =>
   {
      User.validate.mockResolvedValue({ userId: existingUser._id })

      const res = await request(app)
         .post("/users/validate")
         .send({ username: existingUser.username, password: existingUser.password })

      expect(res.status).toBe(200)
      expect(res.body.message).toMatch(/User credentials validated successfully/)

   })

   it("should return an error for invalid username", async () =>
   {
      User.validate.mockRejectedValue(new Error("User not found"))

      const res = await request(app)
         .post("/users/validate")
         .send({ username: "invalidUser", password: "password" })

      expect(res.status).toBe(404)
      expect(res.body.message).toMatch(/User not found/)
   })

   it("should return an error for invalid password", async () =>
   {
      User.validate.mockRejectedValue(new Error("Invalid password"))

      const res = await request(app)
         .post("/users/validate")
         .send({ username: existingUser.username, password: "wrongpassword" })

      expect(res.status).toBe(401)
      expect(res.body.message).toMatch(/Invalid password/)
   })
})

describe("GET /users/:id", () =>
{
   it("should get a user with given id", async () =>
   {
      verifyAccessToken.mockImplementation((req, res, next) => next())
      User.getById.mockResolvedValue({ user: existingUser })

      const res = await request(app).get(`/users/${existingUser._id}`)

      expect(res.status).toBe(200)
      expect(res.body.user).toStrictEqual(existingUser)
   })

   it("should return an error if user does not exist", async() =>
   {
      verifyAccessToken.mockImplementation((req, res, next) => next())

      User.getById.mockRejectedValue(new Error("User not found"))

      const res = await request(app).get("/users/2")

      expect(res.status).toBe(404)
      expect(res.body.message).toMatch(/User not found/)
   })
})

describe("GET /users", () =>
{
   it("should get all users", async () =>
   {
      verifyAccessToken.mockImplementation((req, res, next) => next())

      User.getAll.mockResolvedValue({ users: allUsers })

      const res = await request(app).get("/users")

      expect(res.status).toBe(200)
      expect(res.body.users).toStrictEqual(allUsers)
   })

   it("should return an error if users do not exist", async() =>
   {
      verifyAccessToken.mockImplementation((req, res, next) => next())

      User.getAll.mockRejectedValue(new Error("No users exist"))

      const res = await request(app).get("/users")

      expect(res.status).toBe(404)
      expect(res.body.message).toMatch(/No users exist/)
   })
})

describe("PUT /users/:id", () =>
{
   it("should update a user's username/password", async() =>
   {
      verifyAccessToken.mockImplementation((req, res, next) => next())

      User.update.mockResolvedValue({ user: existingUser })

      const res = await request(app)
         .put(`/users/${existingUser._id}`)
         .send({ username: updatedUser.username, password: updatedUser.password })

      expect(res.status).toBe(200)
      expect(res.body.message).toMatch(/User 1 updated successfully./)

   })

   it("should return an error if user does not exist", async() =>
   {
      verifyAccessToken.mockImplementation((req, res, next) => next())

      User.update.mockRejectedValue(new Error("User not found"))

      const res = await request(app)
         .put(`/users/${existingUser._id}`)
         .send({ username: updatedUser.username, password: updatedUser.password })

      expect(res.status).toBe(404)
      expect(res.body.message).toMatch(/User not found/)
   })

   it("should return an error if username and/or password not provided", async() =>
   {
      verifyAccessToken.mockImplementation((req, res, next) => next())

      User.update.mockRejectedValue(new Error("Username and/or password not provided"))

      const res = await request(app)
         .put(`/users/${existingUser._id}`)
         .send({})

      expect(res.status).toBe(400)
      expect(res.body.message).toMatch(/Username and\/or password not provided/)
   })
})

