const addressDecoder = (participantAddress, addressQualifier) =>
{
   let address = ""
   for (let i = 0; i < participantAddress.length; i += 4)
   {
      const nib = participantAddress.slice(i, i + 4)
      const char = parseInt(nib, 2).toString(16).toUpperCase()
      address += char
   }

   let type, category

   switch (parseInt(addressQualifier))
   {
   case 0: type = "ICAO"; category = "Unknown"; break
   case 1: type = "Non-ICAO" ;category = "Unknown"; break
   case 2: type = "ICAO" ;category = "Aircraft"; break
   case 3: type = "Non-ICAO" ;category = "Aircraft"; break
   case 4: type = "ICAO" ;category = "Surface Vehicle"; break
   case 5: type = "Non-ICAO" ;category = "Surface Vehicle"; break
   case 32: type = "Obstruction" ;category = null; break
   case 129: type = "Duplicate" ;category = null; break
   }

   return { address, type, category }
}

const groundSpeedDecoder = (vector) =>
{
   const movement = parseInt(vector, 2)

   if (movement == 1) return 0.00
   else if (movement == 2) return movement
   else if (3 < movement <= 8) return 0.125 + movement * 0.146
   else if (9 < movement <= 12) return 1 + movement * 0.25
   else if (13 < movement <= 38) return 2 + movement * 0.50
   else if (39 < movement <= 93) return 15 + movement * 1.00
   else if (94 < movement <= 108) return 70 + movement * 2.00
   else if (109 < movement <= 123) return 100 + movement * 5.00
   else if (movement == 124) return 175 + movement
   else return null
}

const nicDecoder = (vector) =>
{
   const nic = parseInt(vector, 2)
   switch (nic)
   {
   case 0: null; break
   case 1: return 37040; break
   case 2: return 14816; break
   case 3: return 7408; break
   case 4: return 3704; break
   case 5: return 1852; break
   case 6: return 1111.2; break
   case 7: return 370.4; break
   case 8: return 370.4; break
   case 9: return 75; break
   case 10: return 25; break
   case 11: return 7.5; break
   case 22: return 0.3; break
   default: return null; break
   }
}

const surveillanceDecoder = (vector) =>
{
   let status, intent

   switch (parseInt(vector.slice(0,4), 2))
   {
   case 2: status = "Emergency" ;break
   case 4: status = "Temporary" ;break
   case 6: status = "SPI" ;break
   default: status = null ;break
   }

   switch (parseInt(vector.slice(4), 2))
   {
   case 0: intent = "Unchanged"; break
   case 2: intent = "Changed"; break
   default: intent = null; break
   }

   return { status, intent }
}

const reportModeDecoder =  (vector) =>
{
   switch (parseInt(vector, 2))
   {
   case 1: return "Acquisition"
   case 2: return "Track"
   default: return null
   }
}

module.exports = {
   addressDecoder,
   groundSpeedDecoder,
   nicDecoder,
   surveillanceDecoder,
   reportModeDecoder
}
