const express = require("express");
const router = express.Router();

const {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} = require("../controllers/userController");

// Base path: /api/users
router.get("/", getUsers);
router.get("/:id", getUserById);

// Handles POST /api/users AND POST /api/users/register
router.post("/", createUser);
router.post("/register", createUser);

router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;