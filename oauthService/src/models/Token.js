const { Schema, model } = require("mongoose")
const { hash, compare } = require("bcryptjs")

const tokenSchema = new Schema(
   {
      userId: { type: Number, required: true },
      tokenId: { type: String, required: true },
      issuedAt: { type: Date, required: true },
      expiresAt: { type: Date, required: true },
      revoked: { type: Boolean, default: false }
   })

tokenSchema.pre("save", async function(next)
{
   const token = this
   if (token.isModified("tokenId")) 
   {
      const hashedToken = await hash(this.tokenId, 8)
      token.tokenId = hashedToken
   }
   next()
})

tokenSchema.statics.create = async function(userId, tokenId, issuedAt, expiresAt)
{
   const token = new this({ userId, tokenId, issuedAt, expiresAt })
   await token.save()
   return { tokenId: token._id }
}

tokenSchema.statics.validate = async function(userId, tokenId)
{
   const token = await this.findOne({ userId })
   if (!token) throw new Error("Token not found")

   const isMatch = await compare(tokenId, token.tokenId)
   if (!isMatch) throw new Error("Token not found")

   if (token.revoked) throw new Error("Token is revoked")

   return { tokenId: token._id }
}

tokenSchema.statics.getAll = async function()
{
   const tokens = await this.find({})
   return { tokens }
}

tokenSchema.statics.revoke = async function(userId, tokenId)
{
   const token = await this.findOneAndUpdate({ userId, tokenId }, { revoked: true }, { new: true })
   if (!token) throw new Error("Token not found")

   const isMatch = await compare(tokenId, token.tokenId)
   if (!isMatch) throw new Error("Token not found")

   token.revoked = true
   await token.save()

   return { token }
}

const Token = model("Token", tokenSchema)

module.exports = Token
