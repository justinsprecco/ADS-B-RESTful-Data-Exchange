/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

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

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     description: Registers a new user and returns the created user ID.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: testUser
 *                 description: The desired username for the new user.
 *               password:
 *                 type: string
 *                 example: password
 *                 description: The password for the new user.
 *     responses:
 *       201:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "User added with ID: 1"
 *       500:
 *         description: Error during user registration.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Error: User registration failed"
 */
router.post("/", postUser)

router.post('/validate', verifyUser, validateUser)

router.get("/:id", verifyAccessToken, getUser)

router.delete("/:id", verifyAccessToken, deleteUser)

router.put("/:id", updateUser)

module.exports = router
