const request = require("supertest")
const app = require("../../src/app")
const Device = require("../../src/models/Device")

// Mock device model
jest.mock("../../src/models/Device")
jest.mock('../../src/database/db', () => ({
   dbConnect: jest.fn(),
   dbDisconnect: jest.fn(),
}))

beforeEach(() =>
{
   jest.clearAllMocks()
})

afterAll(() =>
{
   jest.clearAllMocks()
})

const newDevice = { _id: 1, userId: 1, macAddress: "00:14:22:01:23:45", latitude: 25, longitude: 10 }
const updatedDevice = { _id: 1, userId: 1, macAddress: "00:14:22:01:23:45", latitude: 29, longitude: 40 }
const userDevices = [
   { _id: 1, userId: 1, macAddress: "00:14:22:01:23:45", latitude: 25, longitude: 10 },
   { _id: 2, userId: 1, macAddress: "00:19:22:11:23:55", latitude: 55, longitude: 11 },
   { _id: 3, userId: 1, macAddress: "00:12:12:01:22:44", latitude: 33, longitude: 68 },
   { _id: 4, userId: 1, macAddress: "00:18:12:05:04:40", latitude: 89, longitude: 90 }
]

describe("POST /users/:id/devices", () =>
{
   it("should add a new device", async () =>
   {
      Device.create.mockResolvedValue(newDevice)

      const res = await request(app)
         .post("/users/1/devices")
         .send({ macAddress: newDevice.macAddress, latitude: newDevice.latitude, longitude: newDevice.longitude })

      expect(res.status).toBe(201)
      expect(res.body.message).toBe(`Device ${newDevice.macAddress} added with id ${newDevice._id} and associated with user ${newDevice.userId}`)
   })

   it("should return an error if adding device fails", async () =>
   {
      Device.create.mockRejectedValue(new Error("Device registration failed"))

      const res = await request(app)
         .post("/users/1/devices")
         .send({ userId: newDevice.userId, macAddress: newDevice.macAddress, latitude: newDevice.latitude, longitude: newDevice.longitude })

      expect(res.status).toBe(500)
      expect(res.body.message).toMatch(/Device registration failed/)
   })
})

describe("GET /users/:id/devices", () =>
{
   it("should get all devices for a given user", async () =>
   {
      Device.getByUserId.mockResolvedValue({ devices: userDevices })

      const res = await request(app).get("/users/1/devices")

      expect(res.status).toBe(200)
      expect(res.body.message).toEqual(userDevices)
      expect(Device.getByUserId).toHaveBeenCalledWith(userDevices[0].userId)
   })

   it("should return an error if no devices exist for user", async () =>
   {
      Device.getByUserId.mockResolvedValue({ devices: [] })

      const res = await request(app).get("/users/2/devices")

      expect(res.status).toBe(404)
      expect(res.body.message).toMatch(/No devices found for this user./)
   })

   it("should return an error if getting devices fails", async () =>
   {
      Device.getByUserId.mockRejectedValue(new Error("Getting devices failed."))

      const res = await request(app).get("/users/2/devices")

      expect(res.status).toBe(500)
      expect(res.body.message).toMatch(/Getting devices failed./)
   })
})

describe("GET /users/:id/devices/:deviceId", () =>
{
   it("should get a device with given ID", async () =>
   {
      Device.getById.mockResolvedValue({ device: newDevice })

      const res = await request(app).get(`/users/1/devices/${newDevice._id}`)

      expect(res.status).toBe(200)
      expect(res.body.message).toEqual(newDevice)
      expect(Device.getById).toHaveBeenCalledWith(newDevice._id)
   })

   it("should return an error if device not found", async () =>
   {
      Device.getById.mockResolvedValue({ device: null })

      const res = await request(app).get(`/users/1/devices/${newDevice._id}`)

      expect(res.status).toBe(404)
      expect(res.body.message).toMatch(/No device found with id 1./)
      expect(Device.getById).toHaveBeenCalledWith(newDevice._id)
   })

   it("should return an error if getting device fails", async () =>
   {
      Device.getById.mockRejectedValue(new Error("Getting device failed."))

      const res = await request(app).get("/users/2/devices/1")

      expect(res.status).toBe(500)
      expect(res.body.message).toMatch(/Getting device failed./)
   })
})

describe("DELETE /users/:id/devices/:deviceId", () =>
{
   it("should delete a device with given ID", async () =>
   {
      Device.delete.mockResolvedValue({ device: newDevice._id })

      const res = await request(app).delete(`/users/1/devices/${newDevice._id}`)

      expect(res.status).toBe(200)
      expect(res.body.message).toMatch(`Device ${newDevice._id} deleted successfully.`)
      expect(Device.delete).toHaveBeenCalledWith(newDevice._id)
   })

   it("should return an error if device not found", async () =>
   {
      Device.delete.mockResolvedValue({ device: null })

      const res = await request(app).delete(`/users/1/devices/${newDevice._id}`)

      expect(res.status).toBe(404)
      expect(res.body.message).toMatch(/No device found with id 1./)
      expect(Device.delete).toHaveBeenCalledWith(newDevice._id)
   })

   it("should return an error if deleting device fails", async () =>
   {
      Device.delete.mockRejectedValue(new Error("Deleting device failed."))

      const res = await request(app).delete("/users/2/devices/1")

      expect(res.status).toBe(500)
      expect(res.body.message).toMatch(/Deleting device failed./)
   })
})

describe("PUT /users/:id/devices/:deviceId", () =>
{
   it("should update a device with given ID with provided values", async () =>
   {
      Device.update.mockResolvedValue({ device: updatedDevice._id })

      const res = await request(app)
         .put(`/users/1/devices/${newDevice._id}`)
         .send({ latitude: updatedDevice.latitude, longitude: updatedDevice.longitude })

      expect(res.status).toBe(200)
      expect(res.body.message).toMatch(`Device ${newDevice._id} updated successfully.`)
      expect(Device.update).toHaveBeenCalledWith(newDevice._id, updatedDevice.latitude, updatedDevice.longitude)
   })

   it("should return an error if latitude or longitude not provided", async () =>
   {
      const res = await request(app)
         .put(`/users/1/devices/${newDevice._id}`)
         .send({})

      expect(res.status).toBe(402)
      expect(res.body.message).toMatch("Include latitude or longitude in body to update")
   })

   it("should return an error if device not found", async () =>
   {
      Device.update.mockResolvedValue({ device: null })

      const res = await request(app)
         .put(`/users/1/devices/${newDevice._id}`)
         .send({ latitude: updatedDevice.latitude, longitude: updatedDevice.longitude })

      expect(res.status).toBe(404)
      expect(res.body.message).toMatch(/No device found with id 1./)
      expect(Device.update).toHaveBeenCalledWith(newDevice._id, updatedDevice.latitude, updatedDevice.longitude)
   })

   it("should return an error if updating device fails", async () =>
   {
      Device.update.mockRejectedValue(new Error("Updating device failed."))

      const res = await request(app)
         .put(`/users/1/devices/${newDevice._id}`)
         .send({ latitude: updatedDevice.latitude, longitude: updatedDevice.longitude })

      expect(res.status).toBe(500)
      expect(res.body.message).toMatch(/Updating device failed./)
   })
})
