const express = require("express")
const router = express.Router()

const {
   validateUserForm,
   verifyAccessToken
} = require("../middleware")

const {
   postUser,
   validateUser,
   getUser,
   deleteUser,
   updateUser,
} = require("../controllers")

router.post("/", postUser)

router.post('/login', validateUserForm, validateUser)

router.get("/:id", verifyAccessToken, getUser)

router.delete("/:id", verifyAccessToken, deleteUser)

router.put("/:id", verifyAccessToken, updateUser)

module.exports = router
