const mongoose = require("mongoose")
const { MongoMemoryReplSet } = require("mongodb-memory-server")
const Device = require("../../src/models/Device")
const User = require("../../src/models/User")

let mongoServer

beforeAll(async () =>
{
   mongoServer = await MongoMemoryReplSet.create({
      replSet: { name: "rs", count: 3 },
   })
   const uri = mongoServer.getUri()
   await mongoose.connect(uri)
})

afterAll(async () =>
{
   await mongoose.disconnect()
   await mongoServer.stop()
})

beforeEach(async () =>
{
   await Device.deleteMany({})
   await User.deleteMany({})
})

describe("Device Model", () =>
{
   it("should create a new device", async () =>
   {
      const { user } = await User.create("testuser", "testpassword")
      const { device } = await Device.create(user._id, "00:14:22:01:23:45", 25, 10)

      expect(device.macAddress).toBe("00:14:22:01:23:45")
      expect(device.latitude).toBe(25)
      expect(device.longitude).toBe(10)
      expect(device.userId.toString()).toBe(user._id.toString())
   })

   test("should not allow duplicate devices", async () =>
   {
      const { user } = await User.create("testuser", "testpassword")
      await Device.create(user._id, "00:14:22:01:23:45", 25, 10)

      await expect(Device.create(user._id, "00:14:22:01:23:45", 30, 20))
         .rejects.toThrow("Device already exists")
   })

   test("should retrieve devices by userId", async () =>
   {
      const { user } = await User.create("testuser", "testpassword")
      await Device.create(user._id, "00:14:22:01:23:45", 25, 10)
      await Device.create(user._id, "00:14:22:01:23:46", 30, 20)

      const { devices } = await Device.getByUserId(user._id)
      expect(devices.length).toBe(2)
      expect(devices[0].macAddress).toBe("00:14:22:01:23:45")
   })

   test("should throw an error if no devices are found for a user", async () =>
   {
      const { user } = await User.create("testuser", "testpassword")
      await expect(Device.getByUserId(user._id)).rejects.toThrow("No devices found for this user")
   })

   test("should retrieve a device by ID", async () =>
   {
      const { user } = await User.create("testuser", "testpassword")
      const { device } = await Device.create(user._id, "00:14:22:01:23:45", 25, 10)

      const retrievedDevice = await Device.getById(device._id)
      expect(retrievedDevice.device.macAddress).toBe("00:14:22:01:23:45")
   })

   test("should delete a device by ID", async () =>
   {
      const { user } = await User.create("testuser", "testpassword")
      const { device } = await Device.create(user._id, "00:14:22:01:23:45", 25, 10)

      const deletedDevice = await Device.delete(device._id)
      const deviceExists = await Device.findById(device._id)

      expect(deletedDevice.deviceId.toString()).toBe(device._id.toString())
      expect(deviceExists).toBeNull()
   })

   test("should update a device's location", async () =>
   {
      const { user } = await User.create("testuser", "testpassword")
      const { device } = await Device.create(user._id, "00:14:22:01:23:45", 25, 10)

      const updatedDevice = await Device.update(device._id, 50, 60)
      expect(updatedDevice.device.latitude).toBe(50)
      expect(updatedDevice.device.longitude).toBe(60)
   })

   test("should throw an error when updating without latitude or longitude", async () =>
   {
      const { user } = await User.create("testuser", "testpassword")
      const { device } = await Device.create(user._id, "00:14:22:01:23:45", 25, 10)

      await expect(Device.update(device._id)).rejects.toThrow(
         "Latitude and/or longitude not provided"
      )
   })
})
