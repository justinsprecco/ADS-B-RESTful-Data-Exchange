const request = require("supertest")
const app = require("../../src/app")
const { ADSMessage } = require("../../src/models/Message")

jest.mock('express-http-proxy', () => () => (req, res, next) => next())
jest.mock("morgan", () => jest.fn(() => (req, res, next) => next()))

// Mock Message model
jest.mock("../../src/models/Message")

jest.mock('../../src/database/db', () => ({
   dbConnect: jest.fn(),
   dbDisconnect: jest.fn(),
}))

beforeEach(() =>
{
   jest.clearAllMocks()
})

const allMessages = [
   { _id: 1, macAddress: "00:14:22:01:23:45", data: "test1", timestamp: "2025-01-01T10:00:00Z" },
   { _id: 2, macAddress: "00:19:22:11:23:55", data: "test2", timestamp: "2025-01-02T11:00:00Z" },
   { _id: 3, macAddress: "00:12:12:01:22:44", data: "test3", timestamp: "2025-01-03T12:00:00Z" },
   { _id: 4, macAddress: "00:18:12:05:04:40", data: "test4", timestamp: "2025-01-04T13:00:00Z" },
   { _id: 5, macAddress: "FB:48:88:D3:AD:4F", data: "test5", timestamp: "2025-01-05T14:00:00Z" },
   { _id: 6, macAddress: "D5:F6:15:26:07:0D", data: "test6", timestamp: "2025-01-06T15:00:00Z" },
   { _id: 7, macAddress: "75:FD:5A:D1:6D:8C", data: "test7", timestamp: "2025-01-07T16:00:00Z" },
   { _id: 8, macAddress: "07:40:52:67:79:9D", data: "test8", timestamp: "2025-01-08T17:00:00Z" },
   { _id: 9, macAddress: "0F:DE:00:A9:4A:A6", data: "test9", timestamp: "2025-01-09T18:00:00Z" },
   { _id: 10, macAddress: "7F:C2:E5:6A:BF:36", data: "test10", timestamp: "2025-01-10T19:00:00Z" },
   { _id: 11, macAddress: "01:57:31:DB:8D:93", data: "test11", timestamp: "2025-01-11T20:00:00Z" },
   { _id: 12, macAddress: "45:23:1D:BE:93:81", data: "test12", timestamp: "2025-01-12T21:00:00Z" },
   { _id: 13, macAddress: "23:EE:D5:C6:0F:6C", data: "test13", timestamp: "2025-01-13T22:00:00Z" },
   { _id: 14, macAddress: "81:87:57:E0:5A:C4", data: "test14", timestamp: "2025-01-14T23:00:00Z" },
   { _id: 15, macAddress: "B6:52:89:AA:E5:E7", data: "test15", timestamp: "2025-01-15T00:00:00Z" },
   { _id: 16, macAddress: "B0:6B:F9:2D:0A:61", data: "test16", timestamp: "2025-01-16T01:00:00Z" },
   { _id: 17, macAddress: "C3:6F:94:DF:AE:47", data: "test17", timestamp: "2025-01-17T02:00:00Z" },
   { _id: 18, macAddress: "C7:EF:7F:60:81:3A", data: "test18", timestamp: "2025-01-18T03:00:00Z" },
   { _id: 19, macAddress: "49:4E:BD:E1:2C:02", data: "test19", timestamp: "2025-01-19T04:00:00Z" },
   { _id: 20, macAddress: "5A:BD:70:EC:F3:F4", data: "test20", timestamp: "2025-01-20T05:00:00Z" }
]

const latestMessages = allMessages
   .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
   .slice(0, 10)

const startTime = new Date("2025-01-05T00:00:00Z")
const endTime = new Date("2025-01-10T23:59:59Z")

const filteredMessages = allMessages.filter(
   message => new Date(message.timestamp) >= startTime && new Date(message.timestamp) <= endTime
)

const sortedMessages = filteredMessages
   .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))

describe("GET /message/ads", () =>
{
   it("should get all ADS messages", async () =>
   {
      ADSMessage.getAll.mockResolvedValue({ messages: allMessages })

      const res = await request(app).get("/message/ads")

      expect(res.status).toBe(200)
      expect(res.body.messages).toStrictEqual(allMessages)
   })

   it("should get all ADS messages within given timeframe", async () =>
   {
      ADSMessage.getByTime.mockResolvedValue({ messages: sortedMessages })

      const res = await request(app).get("/message/ads?start=2025-04-01T00:00Z&end=2025-04-01T23:59Z")

      expect(res.status).toBe(200)
      expect(res.body.messages).toStrictEqual(sortedMessages)
   })

   it("should return an error if messages do not exist", async() =>
   {
      ADSMessage.getAll.mockRejectedValue(new Error("No messages found"))

      const res = await request(app).get("/message/ads")

      expect(res.status).toBe(404)
      expect(res.body.message).toMatch(/No messages found/)
   })
})

describe("GET /message/ads/latest", () =>
{
   it("should get latest ADS messages", async () =>
   {
      ADSMessage.getLatest.mockResolvedValue({ messages: latestMessages })

      const res = await request(app).get("/message/ads/latest")

      expect(res.status).toBe(200)
      expect(res.body.messages).toStrictEqual(latestMessages)
   })
})
