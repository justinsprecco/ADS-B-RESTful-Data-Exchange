const { Schema, model } = require("mongoose")
const { hash, compare } = require("bcryptjs")

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
      username:
    {
       type: String,
       required: true
    },
      password:
    {
       type: String,
       required: true
    },
      numLandings: Number,
      touchAndGo: Number
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

   const newUser = new this({ username, password })
   await newUser.save()
   return { user: newUser }
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
   const users = this.find({})
   return { users }
}

userSchema.statics.delete = async function(userId)
{
   const user = await this.findByIdAndDelete(userId)
   if (!user) throw new Error("User not found")

   return { user }
}

userSchema.statics.update = async function(userId, username, password)
{
   const updates = {}
   if (username !== undefined) updates.username = username
   if(password !== undefined) updates.password = password

   const user = await this.findByIdAndUpdate(userId, updates)
   if (!user) throw new Error("User not found")

   return { user }
}

const User = model("User", userSchema)

module.exports = User
