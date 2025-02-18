const stateVectorFields = require("../definitions/stateVectorFields")

const stateVectorParser = (message) =>
{
   const reportType = message.slice(0, 4)
   const includeFlags = message.slice(4, 24)
   const validityFlags = message.slice(24, 40)

   const stateVectors = {}

   let offset = 0

   stateVectorFields.forEach(field =>
   {
      if (field.omit?.(includeFlags)) return

      if (field.valid?.(validityFlags) == false)
      {
         offset += field.length
         return
      }

      const vector = message.slice(offset, offset + field.length)

      stateVectors[field.name] = vector
      offset += field.length
   })

   return stateVectors
}

module.exports = stateVectorParser
