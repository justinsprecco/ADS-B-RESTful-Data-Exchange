/*
   This file provides middleware that cleanses and verifies user input.

   TODO: validate routes expecting user id
   TODO: validate all device routes
*/

exports.validateUserForm = async (req, res, next) => 
{
   const { username, password } = req.body

   if (!password || password.length < 1 || !username || username.length < 1)
   {
      return res.status(400).json({ message: "Username or password not provided." })
   }

   req.body = { username, password }

   next()
}
