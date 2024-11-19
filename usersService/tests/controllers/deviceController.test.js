const request = require("supertest")
const app = require("../../src/app")
const Device = require("../../src/models/Device")

// Mock device model
jest.mock("../../src/models/Device")

beforeEach(() => 
{
   jest.clearAllMocks()
})

describe("POST /users/:id/devices", () => 
{
   it("should add a new device", async () => 
   {
      Device.postDevice.mockResolvedValue({ id: 1, userId: 1, macAddress: "00:14:22:01:23:45", latitude: 25, longitutde: 10 })

      const res = await request(app)
         .post("/users/1/devices")
         .send({ macAddress: "00:14:22:01:23:45", latitude: 25, longitutde: 10 })

      expect(res.status).toBe(201)
      expect(res.body.message).toBe("Device 00:14:22:01:23:45 added with id 1 and associated with user 1")
   })

   it("should return an error if adding device fails", async () => 
   {
      // Setup mock to throw an error
      Device.postDevice.mockRejectedValue(new Error("Device registration failed"))

      const res = await request(app)
         .post("/users/1/devices")
         .send({ userId: 8, macAddress: "00:14:22:01:23:45", latitude: 25, longitutde: 10 })

      expect(res.status).toBe(500)
      expect(res.body.message).toMatch(/Device registration failed/)
   })
})
