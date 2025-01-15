const { Schema, model, startSession } = require("mongoose")
const { hash, compare } = require("bcryptjs")
const Device = require("./Device")

/*
The user schema contains the id of a user and the number of
landings/touchandgo during its entire lifetime for all of its groundstations.

numLandings contain the total number of landings (not including touch and go)
for a user.

touchAndGo specifically contain the total number of "touch and go" for a
user.
*/
const userSchema = new Schema(
   {
      username: { type: String, required: true },
      password: { type: String, required: true },
      devices: [{ type: Schema.Types.ObjectId, ref: "Device" }],
      numLandings: Number,
      touchAndGo: Number,
   }
)

userSchema.pre("save", async function(next)
{
   const user = this
   if (user.isModified("password"))
   {
      const hashedPassword = await hash(this.password, 8)
      user.password = hashedPassword
   }
   next()
})

userSchema.statics.create = async function(username, password)
{
   const existingUser = await this.findOne({ username })
   if (existingUser) throw new Error("Username already exists")

   const user = new this({ username, password })
   await user.save()
   return { user }
}

userSchema.statics.validate = async function(username, password)
{
   const user = await this.findOne({ username })
   if (!user) throw new Error("User not found")

   const isMatch = await compare(password, user.password)
   if (!isMatch) throw new Error("Invalid password")

   return { userId: user._id }
}

userSchema.statics.getById = async function(userId)
{
   const user = await this.findById(userId)
   if (!user) throw new Error("User not found")
   return { user }
}

userSchema.statics.getAll = async function()
{
   const users = await this.find({})
   if (!users.length) throw new Error("No users exist")
   return { users }
}

userSchema.statics.delete = async function(userId)
{
   const session = await startSession()

   try
   {
      session.startTransaction()
      const user = await this.findByIdAndDelete(userId).session(session)
      if (!user) throw new Error("User not found")

      await Device.deleteMany({ userId }).session(session)

      await session.commitTransaction()
      return { userId: user._id }
   }
   catch (error)
   {
      await session.abortTransaction()
      throw error
   }
   finally
   {
      session.endSession()
   }
}

userSchema.statics.update = async function(userId, username, password)
{
   const user = await this.findById(userId)
   if (!user) throw new Error("User not found")

   if (!username && !password) throw new Error("Username and/or password not provided")

   if (username !== undefined) user.username = username
   if (password !== undefined) user.password = password

   await user.save()

   return { user }
}

const User = model("User", userSchema)

module.exports = User
