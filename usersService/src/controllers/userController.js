const User = require("../models/User.js")

// post "/users"
// create user
exports.postUser = async (req, res) =>
{
   const { username, password } = req.body

   try
   {
      const { user } = await User.create(username, password)

      return res.status(201).json({ message: `User ${user.username} created successfully with ID: ${user._id}`})
   }
   catch (err)
   {
      const status = err.message === "Username already exists" ? 409 : 500
      return res.status(status).json({ message: err.message })
   }
}

// post "/users/validate"
// validate that user login information is correct when user first logs into the application
exports.validateUser = async (req, res) =>
{
   const { username, password } = req.body

   try
   {
      const { userId } = await User.validate(username, password)

      return res.status(200).json({ message: "User credentials validated successfully" })
   }
   catch (err)
   {
      const status = err.message === "User not found" ? 404 : err.message === "Invalid password" ? 401 : 500
      return res.status(status).json({ message: err.message })
   }
}

// get "/users"
exports.getUsers = async (req, res) =>
{
   try
   {
      const { users } = await User.getAll()
      return res.status(200).json({ users })
   }
   catch (err)
   {
      const status = err.message === "No users exist" ? 404 : 500
      return res.status(status).json({ message: err.message })
   }
}

// get "/users/:id"
// get user given user id
exports.getUser = async (req, res) =>
{
   try
   {
      const userId = req.params.id

      const { user } = await User.getById(userId)

      return res.status(200).json({ user })
   }
   catch (err)
   {
      const status = err.message === "User not found" ? 404 : 500
      return res.status(status).json({ message: err.message })
   }

}

// delete "/users/:id"
// delete user given user id
exports.deleteUser = async (req, res) =>
{
   try
   {
      const id = req.params.id

      const { userId } = await User.delete(id)

      return res.status(200).json({ message: `User ${userId} deleted successfully.` })
   }
   catch (err)
   {
      const status = err.message === "User not found" ? 404 : 500
      return res.status(status).json({ message: err.message })
   }
}

// put "/users/:id"
// update user given user id
exports.updateUser = async (req, res) =>
{
   try
   {
      const id = req.params.id
      const { username, password } = req.body

      const { user } = await User.update(id, username, password)

      return res.status(200).json({ message: `User ${user._id} updated successfully.` })
   }
   catch (err)
   {
      const status = err.message === "User not found" ? 404 : err.message === "Username and/or password not provided" ? 400 : 500
      return res.status(status).json({ message: err.message })
   }
}
