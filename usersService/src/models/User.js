const crypto = require('crypto')
const { db } = require("../database/db")

exports.postUser = async (username, password) => 
{
   const salt = crypto.randomBytes(32).toString('hex')
   const hash = crypto.pbkdf2Sync(password, salt, 1000, 32, 'sha256').toString("hex")

   const query = {
      text: "INSERT INTO users (username, password, salt) VALUES ($1, $2, $3) RETURNING *",
      values: [username, hash, salt]
   }

   const results = await db.query(query)
   return results[0]

   // TODO: add code that checks if user already exists!

}

exports.validateUser = async (username, password) => 
{
   const salt = await getSalt(username)
   if (!salt)
   {
      throw new Error('User not found in the system.')
   }

   const hash = crypto.pbkdf2Sync(password, salt, 1000, 32, 'sha256').toString("hex")

   const query = {
      text: "SELECT id FROM users WHERE username=$1 AND password=$2",
      values: [username, hash]
   }

   const results = await db.query(query)
   const user = results[0]

   if (!user) throw new Error("Invalid Password.")

   return user
}

const getSalt = async(username) => 
{

   const query = {
      text: "SELECT salt from users WHERE username=$1",
      values: [username]
   }

   const results = await db.query(query)

   return results[0].salt
}

exports.getUser = async (userId) =>
{
   const query = {
      text: 'SELECT username FROM users WHERE id = $1',
      values: [userId]
   }

   const results = await db.query(query)
   const user = results[0]

   if (!user) throw new Error("User doesn't exist.")

   return user
}

exports.getUsers = async () => 
{
   const query = "SELECT username FROM users ORDER BY id ASC"
   const results = await db.query(query)
   if (!results) throw new Error("Users could not be retrieved!")
   return results
}

// delete '/users/:id'
// delete user given user id
exports.deleteUser = async (userId) =>
{
   const query = {
      text: 'DELETE FROM users WHERE id = $1',
      values: [userId]
   }

   const results = db.query(query)
   if (!results) throw new Error("Unable to delete user.")
}

// put '/users/:id'
// update user given user id
exports.updateUser = async (userId, username, password) =>
{

   const salt = crypto.randomBytes(32).toString('hex')
   const hash = crypto.pbkdf2Sync(password, salt, 1000, 32, 'sha256').toString("hex")

   const queries = [
      {
         text: "UPDATE users SET username=$2, password=$3, salt=$4 WHERE id = $1",
         values: [id, username, hash, salt]
      },
      {
         text: "UPDATE users SET username=$2 WHERE id = $1",
         values: [id, username]
      },
      {
         text: "UPDATE users SET password=$2, salt=$3 WHERE id = $1",
         values: [id, hash, salt]
      }
   ]

   let results = null
   if (username && password)
   {
      results = await db.query(queries[0])
   }
   else if (username)
   {
      results = await db.query(queries[1])
   }
   else if (password)
   {
      results = await db.query(queries[2])
   }

   return results
}
