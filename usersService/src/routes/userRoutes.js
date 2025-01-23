const express = require("express")
const router = express.Router()

const {
   validateUserForm,
   verifyAccessToken
} = require("../middleware")

const {
   postUser,
   validateUser,
   getUsers,
   getUser,
   deleteUser,
   updateUser,
} = require("../controllers")

router.post("/", postUser)

router.post('/validate', validateUserForm, validateUser)

router.get("/", verifyAccessToken, getUsers)

router.get("/:id", verifyAccessToken, getUser)

router.delete("/:id", verifyAccessToken, deleteUser)

router.put("/:id", verifyAccessToken, updateUser)

module.exports = router
