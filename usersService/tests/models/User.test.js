const mongoose = require("mongoose")
const { MongoMemoryReplSet } = require("mongodb-memory-server")
const User = require("../../src/models/User")
const Device = require("../../src/models/Device")

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
   await User.deleteMany({})
   await Device.deleteMany({})
})

describe("User Model", () =>
{
   it("should hash password before saving", async () =>
   {
      const user = new User({ username: "testuser", password: "plainpassword" })
      expect(user.password).toBe("plainpassword")
      await user.save()
      expect(user.password).not.toBe("plainpassword")

      const isMatch = await require("bcryptjs").compare("plainpassword", user.password)
      expect(isMatch).toBe(true)
   })

   it("should create a new user", async () =>
   {
      const { user } = await User.create("testuser", "testpassword")
      expect(user.username).toBe("testuser")
      expect(user.password).not.toBe("testpassword")
   })

   it("should throw an error if username already exists", async () =>
   {
      await User.create("testuser", "testpassword")
      await expect(User.create("testuser", "anotherpassword")).rejects.toThrow("Username already exists")
   })

   it("should validate correct username and password", async () =>
   {
      await User.create("testuser", "testpassword")
      const { userId } = await User.validate("testuser", "testpassword")

      expect(userId).toBeDefined()
   })

   it("should throw error for invalid password", async () =>
   {
      await User.create("testuser", "testpassword")
      await expect(User.validate("testuser", "wrongpassword")).rejects.toThrow("Invalid password")
   })

   it("should retrieve user by ID", async () =>
   {
      const { user } = await User.create("testuser", "testpassword")
      const foundUser = await User.getById(user._id)

      expect(foundUser.user.username).toBe("testuser")
   })

   it("should return all users", async () =>
   {
      await User.create("user1", "password1")
      await User.create("user2", "password2")

      const { users } = await User.getAll()
      expect(users.length).toBe(2)
   })

   it("should delete a user and their devices", async () =>
   {
      const { user } = await User.create("testuser", "testpassword")
      await Device.create(user._id, "00:14:22:01:23:45", 25, 10)

      await User.delete(user._id)
      const userExists = await User.findById(user._id)
      const devices = await Device.find({ userId: user._id })

      expect(userExists).toBeNull()
      expect(devices.length).toBe(0)
   })

   it("should update a user's username and/or password", async () =>
   {
      const { user } = await User.create("testuser", "testpassword")
      const { user: updatedUser } = await User.update(user._id, "newuser", "newpassword")

      expect(updatedUser.username).toBe("newuser")
      const isMatch = await require("bcryptjs").compare("newpassword", updatedUser.password)
      expect(isMatch).toBe(true)
   })

   it("should throw an error for missing update fields", async () =>
   {
      const { user } = await User.create("testuser", "testpassword")
      await expect(User.update(user._id)).rejects.toThrow("Username and/or password not provided")
   })
})
