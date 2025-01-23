const { Schema, model } = require("mongoose")
const { hash, compare } = require("bcryptjs")

const tokenSchema = new Schema(
   {
      userId: { type: String, required: true },
      token: { type: String, required: true },
      issuedAt: { type: Date, required: true },
      expiresAt: { type: Date, required: true },
      revoked: { type: Boolean, default: false },
      scope: { type: String, default: "user" }
   })

tokenSchema.pre("save", async function(next)
{
   if (this.isModified("token"))
   {
      this.token = await hash(this.token, 8)
   }
   next()
})

tokenSchema.statics.create = async function(userId, token, issuedAt, expiresAt, scope)
{
   const newToken = new this({ userId, token, issuedAt, expiresAt, scope })
   await newToken.save()
   return { tokenId: newToken._id }
}

tokenSchema.statics.validate = async function(userId, token)
{
   const existingToken = await this.findOne({ userId })
   if (!existingToken) throw new Error("Token not found")

   const isMatch = await compare(token, existingToken.token)
   if (!isMatch) throw new Error("Token is invalid")

   if (existingToken.revoked) throw new Error("Token is revoked")

   if (existingToken.expiresAt <= new Date()) throw new Error("Token is expired")

   return { scope: existingToken.scope }
}

tokenSchema.statics.getAll = async function()
{
   const tokens = await this.find({})
   return { tokens }
}

tokenSchema.statics.revoke = async function(userId, token)
{
   const existingToken = await this.findOne({ userId })
   if (!existingToken) throw new Error("Token not found")

   const isMatch = await compare(token, existingToken.token)
   if (!isMatch) throw new Error("Token is invalid")

   existingToken.revoked = true
   await existingToken.save()

   return { tokenId: existingToken._id }
}

const Token = model("Token", tokenSchema)

module.exports = Token
