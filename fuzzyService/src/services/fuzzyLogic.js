const planeStates = new Map()

function determineLanding(current, previous)
{
   // TODO: Fuzzy Stuff

   return false
}

const fuzzyLogic = async(message) =>
{
   const { icaoAddress } = message

   const previousState = planeStates.get(icaoAddress) || null

   planeStates.set(icaoAddress, message)

   return determineLanding(message, previousState)

}
module.exports = fuzzyLogic
