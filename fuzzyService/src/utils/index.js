const hexToBin = (message) =>
{
   const buffer = Buffer.from(message, "hex")

   let binMessage = ''
   buffer.forEach(byte => binMessage += byte.toString(2).padStart(8, "0"))

   return binMessage
}

const twosComplement = (vector, resolution) =>
{
   let value = parseInt(vector, 2)

   if (vector[0] === '1') value -= (1 << vector.length)

   return value * resolution
}

module.exports = { hexToBin, twosComplement }
