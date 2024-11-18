const User = require("../models/User.js")
const { getAuthCode } = require("../services/authService")
const { post } = require("axios")

// post "/users"
// create user
exports.postUser = async (req, res) =>
{
   const { username, password } = req.body

   try
   {
      const user = await User.postUser(username, password)

      return res.status(201).json({ message: `User added with ID: ${user.id}` })
   }
   catch (err) 
   {
      return res.status(500).json({ message: "Error: User registration failed: " + err })
   }
}

// post "/users/validate"
// validate that user login information is correct when user first logs into the application
exports.validateUser = async (req, res) =>
{
   const { username, password } = req.body

   try
   {
      const user = await User.validateUser(username, password)
      if (!user) 
      {
         return res.status(401).json({ message: "Invalid username or password" })
      }

      return res.status(200).json({ message: "User credentials validated successfully" })
   }
   catch (err)
   {
      return res.status(500).json({ message: "Error: User login failed. " + err })
   }
}

// get "/users?limit=<param>&start[< "l,g" + "e, ">]=<param>"
// the below code will just return ALL users.
exports.getUsers = async (req, res) =>
{
   try
   {
      const users = await User.getUsers()
      return res.status(200).json(users)
   }
   catch (err)
   {
      return res.status(500).json({ message: "Error: Unable to retrieve user list." + err })
   }
}

// get "/users/:id"
// get user given user id
exports.getUser = async (req, res) =>
{
   try 
   {
      const id = parseInt(req.params.id)

      const user = await User.getUser(id)

      return res.status(200).json(user)
   }
   catch (err)
   {
      return res.status(500).json({ message: "Error: Unable to retrieve user." + err })
   }

}

// delete "/users/:id"
// delete user given user id
exports.deleteUser = async (req, res) =>
{
   try
   {
      const id = parseInt(req.params.id)

      await User.deleteUser(id)

      return res.status(200).json({ message: `user ${id} deleted.` })
   }
   catch (err)
   {
      return res.status(500).json({ message: "Error: Unable to delete user." + err })
   }
}

// put "/users/:id"
// update user given user id
exports.updateUser = async (req, res) =>
{
   try
   {
      const id = parseInt(req.params.id)
      const { username, password } = req.body

      const results = await User.updateUser(id, username, password)

      if (!results) 
      {
         return res.status(402).json({ message: "Include username or password in body to update" })
      }

      return res.status(200).json({ message: `User ${id} updated.` })
   }
   catch (err)
   {
      return res.status(500).json({ message: "Error: Unable to update user." + err })
   }

}
