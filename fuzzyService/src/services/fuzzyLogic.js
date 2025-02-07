const planeStates = new Map()

function determineLanding(current, previous)
{
   // TODO: Fuzzy Stuff

   return false
}

const fuzzyLogic = async(message) =>
{
   const { participant } = message

   const previousState = planeStates.get(participant.address) || null

   planeStates.set(participant.address, message)

   return determineLanding(message, previousState)

}
module.exports = fuzzyLogic
