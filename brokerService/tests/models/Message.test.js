const mongoose = require("mongoose")
const { MongoMemoryServer } = require("mongodb-memory-server")
const { ADSMessage, RadarMessage } = require("../../src/models/Message")

let mongoServer

beforeAll(async () =>
{
   mongoServer = await MongoMemoryServer.create()
   await mongoose.connect(mongoServer.getUri())
})

afterAll(async () =>
{
   await mongoose.disconnect()
   await mongoServer.stop()
})

beforeEach(async () =>
{
   await ADSMessage.deleteMany({})
   await RadarMessage.deleteMany({})
})

describe("ADSMessage Model", () =>
{
   test("should create a new ADS message", async () =>
   {
      const data = Buffer.from("test data")
      const macAddress = "00:14:22:01:23:45"
      const timestamp = new Date()

      const { message } = await ADSMessage.create(data, macAddress, timestamp)

      expect(message.macAddress).toBe(macAddress)
      expect(message.data.toString()).toBe("test data")
      expect(message.timestamp).toEqual(timestamp)
   })

   test("should retrieve all ADS-B messages", async () =>
   {
      const data1 = Buffer.from("data1")
      const data2 = Buffer.from("data2")
      const macAddress = "00:14:22:01:23:45"

      await ADSMessage.create(data1, macAddress, new Date())
      await ADSMessage.create(data2, macAddress, new Date())

      const { messages } = await ADSMessage.getAll()
      expect(messages.length).toBe(2)
   })

   test("should retrieve the latest 10 ADS-B messages", async () =>
   {
      const macAddress = "00:14:22:01:23:45"

      for (let i = 0; i < 12; i++)
      {
         await ADSMessage.create(Buffer.from(`data${i}`), macAddress, new Date())
      }

      const { messages } = await ADSMessage.getLatest()
      expect(messages.length).toBe(10)
      expect(messages[0].data.toString()).toBe("data11")
   })

   test("should retrieve ADS-B messages within a specific time range", async () =>
   {
      const macAddress = "00:14:22:01:23:45"

      const now = new Date()
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
      const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000)

      await ADSMessage.create(Buffer.from("old message"), macAddress, twoHoursAgo)
      await ADSMessage.create(Buffer.from("recent message"), macAddress, oneHourAgo)

      const { messages } = await ADSMessage.getByTime(oneHourAgo, now)
      expect(messages.length).toBe(1)
      expect(messages[0].data.toString()).toBe("recent message")
   })
})

describe("RadarMessage Model", () =>
{
   test("should create a new radar message", async () =>
   {
      const data = Buffer.from("test data")
      const macAddress = "00:14:22:01:23:45"
      const timestamp = new Date()

      const { message } = await RadarMessage.create(data, macAddress, timestamp)

      expect(message.macAddress).toBe(macAddress)
      expect(message.data.toString()).toBe("test data")
      expect(message.timestamp).toEqual(timestamp)
   })

   test("should retrieve all radar messages", async () =>
   {
      const data1 = Buffer.from("data1")
      const data2 = Buffer.from("data2")
      const macAddress = "00:14:22:01:23:45"

      await RadarMessage.create(data1, macAddress, new Date())
      await RadarMessage.create(data2, macAddress, new Date())

      const { messages } = await RadarMessage.getAll()
      expect(messages.length).toBe(2)
   })

   test("should retrieve the latest 10 radar messages", async () =>
   {
      const macAddress = "00:14:22:01:23:45"

      for (let i = 0; i < 12; i++)
      {
         await RadarMessage.create(Buffer.from(`data${i}`), macAddress, new Date())
      }

      const { messages } = await RadarMessage.getLatest()
      expect(messages.length).toBe(10)
      expect(messages[0].data.toString()).toBe("data11")
   })

   test("should retrieve radar messages within a specific time range", async () =>
   {
      const macAddress = "00:14:22:01:23:45"

      const now = new Date()
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
      const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000)

      await RadarMessage.create(Buffer.from("old message"), macAddress, twoHoursAgo)
      await RadarMessage.create(Buffer.from("recent message"), macAddress, oneHourAgo)

      const { messages } = await RadarMessage.getByTime(oneHourAgo, now)
      expect(messages.length).toBe(1)
      expect(messages[0].data.toString()).toBe("recent message")
   })
})
