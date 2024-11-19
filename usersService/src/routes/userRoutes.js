const express = require("express")
const router = express.Router()

const {
   verifyUser,
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

router.post('/validate', verifyUser, validateUser)

router.get("/:id", verifyAccessToken, getUser)

router.delete("/:id", verifyAccessToken, deleteUser)

router.put("/:id", updateUser)

module.exports = router
