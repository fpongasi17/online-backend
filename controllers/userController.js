const db = require("../db/database");
const bcrypt = require("bcryptjs");

// GET all users
const getUsers = async (req, res) => {
    try {
        const result = await db.execute("SELECT * FROM user");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET user by ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.execute({
            sql: "SELECT * FROM user WHERE user_id = ?",
            args: [id]
        });

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(result.rows[0]);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// CREATE user
const createUser = async (req, res) => {
    try {
        const {
            user_login,
            user_pass,
            fname,
            lname,
            gender,
            user_level,
            branch_cd,
            email,
            user_activation_key,
            isActive
        } = req.body;

        // Basic validation for required fields
        if (!user_login || !user_pass) {
            return res.status(400).json({ error: "Username and Password are required." });
        }

        const hashedPassword = await bcrypt.hash(user_pass, 10);

        // Map fields and assign default values to avoid 'undefined' errors with Turso DB
        const args = [
            user_login ?? "",
            hashedPassword ?? "",
            fname ?? "",
            lname ?? "",
            gender ?? "Unspecified",
            user_level ?? "user",
            branch_cd ?? "MAIN",
            email ?? "",
            user_activation_key ?? "",
            isActive ?? 1
        ];

        await db.execute({
            sql: `
            INSERT INTO user
            (
                user_login,
                user_pass,
                fname,
                lname,
                gender,
                user_level,
                branch_cd,
                email,
                user_activation_key,
                isActive
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            args: args
        });

        res.status(201).json({
            success: true,
            message: "User created successfully"
        });

    } catch (err) {
        console.error("Registration Error:", err);
        res.status(500).json({
            error: err.message
        });
    }
};

// UPDATE user
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            user_login,
            fname,
            lname,
            gender,
            user_level,
            branch_cd,
            email,
            isActive
        } = req.body;

        await db.execute({
            sql: `
                UPDATE user
                SET
                    user_login = ?,
                    fname = ?,
                    lname = ?,
                    gender = ?,
                    user_level = ?,
                    branch_cd = ?,
                    email = ?,
                    isActive = ?
                WHERE user_id = ?
            `,
            args: [
                user_login ?? "",
                fname ?? "",
                lname ?? "",
                gender ?? "",
                user_level ?? "user",
                branch_cd ?? "MAIN",
                email ?? "",
                isActive ?? 1,
                id
            ]
        });

        res.json({ message: "User updated successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        await db.execute({
            sql: "DELETE FROM user WHERE user_id = ?",
            args: [id]
        });

        res.json({ message: "User deleted successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};