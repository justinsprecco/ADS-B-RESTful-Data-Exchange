const request = require("supertest")
const app = require("../../src/app")
const Device = require("../../src/models/Device")
const User = require("../../src/models/User")
const { verifyAccessToken } = require("../../src/middleware/authMiddleware")

jest.mock("morgan", () => jest.fn(() => (req, res, next) => next()))
// Mock device model
jest.mock("../../src/models/Device")

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
   verifyAccessToken.mockImplementation((req, res, next) => next())
})

const invalidId = 938

const newDevice = { _id: 1, userId: 1, macAddress: "00:14:22:01:23:45", latitude: 25, longitude: 10 }
const updatedDevice = { _id: 1, userId: 1, macAddress: "00:14:22:01:23:45", latitude: 29, longitude: 40 }
const userDevices = [
   { _id: 1, userId: 1, macAddress: "00:14:22:01:23:45", latitude: 25, longitude: 10 },
   { _id: 2, userId: 1, macAddress: "00:19:22:11:23:55", latitude: 55, longitude: 11 },
   { _id: 3, userId: 1, macAddress: "00:12:12:01:22:44", latitude: 33, longitude: 68 },
   { _id: 4, userId: 1, macAddress: "00:18:12:05:04:40", latitude: 89, longitude: 90 }
]

const existingUser = { _id: 1, username: "user123", password: "password123", devices: userDevices }

describe("POST /users/:id/devices", () =>
{
   it("should create a new device", async () =>
   {
      User.getById.mockResolvedValue({ user: existingUser })
      Device.create.mockResolvedValue({ device: newDevice })

      const res = await request(app)
         .post("/users/1/devices")
         .send({ macAddress: newDevice.macAddress, latitude: newDevice.latitude, longitude: newDevice.longitude })

      expect(res.status).toBe(201)
      expect(res.body.message).toBe(`Device ${newDevice.macAddress} added with id ${newDevice._id} and associated with user ${newDevice.userId}`)
   })

   it("should return an error if device already exists", async () =>
   {
      User.getById.mockResolvedValue({ user: existingUser })
      Device.create.mockRejectedValue(new Error("Device already exists"))

      const res = await request(app)
         .post("/users/1/devices")
         .send({ macAddress: newDevice.macAddress, latitude: newDevice.latitude, longitude: newDevice.longitude })

      expect(res.status).toBe(409)
      expect(res.body.message).toMatch(/Device already exists/)
   })

   it("should return an error if user does not exists", async () =>
   {
      User.getById.mockRejectedValue(new Error("User not found"))

      const res = await request(app)
         .post("/users/1/devices")
         .send({ macAddress: newDevice.macAddress, latitude: newDevice.latitude, longitude: newDevice.longitude })

      expect(res.status).toBe(404)
      expect(res.body.message).toMatch(/User not found/)
   })
})

describe("GET /users/:id/devices/:deviceId", () =>
{
   it("should get a device with given id", async () =>
   {
      User.getById.mockResolvedValue({ user: existingUser })
      Device.getById.mockResolvedValue({ device: newDevice })

      const res = await request(app).get(`/users/${newDevice.userId}/devices/${newDevice._id}`)

      expect(res.status).toBe(200)
      expect(res.body.device).toStrictEqual(newDevice)
   })

   it("should return an error if device does not exist", async() =>
   {
      User.getById.mockResolvedValue({ user: existingUser })
      Device.getById.mockRejectedValue(new Error("Device not found"))

      const res = await request(app).get(`/users/1/devices/${invalidId}`)

      expect(res.status).toBe(404)
      expect(res.body.message).toMatch(/Device not found/)
   })
})

describe("GET /users/:id/devices", () =>
{
   it("should get all devices for a given user", async () =>
   {
      User.getById.mockResolvedValue({ user: existingUser })
      Device.getByUserId.mockResolvedValue({ devices: userDevices })

      const res = await request(app).get(`/users/1/devices`)

      expect(res.status).toBe(200)
      expect(res.body.devices).toStrictEqual(userDevices)
   })

   it("should return an error if user has no devices", async() =>
   {
      User.getById.mockResolvedValue({ user: existingUser })
      Device.getByUserId.mockRejectedValue(new Error("No devices found for this user"))

      const res = await request(app).get("/users/1/devices")

      expect(res.status).toBe(404)
      expect(res.body.message).toMatch(/No devices found for this user/)
   })
})

// TODO: Finish tests for controller
