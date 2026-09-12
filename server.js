const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db/database");
const userRoutes = require("./routes/users");

const app = express();

app.use(cors());
app.use(express.json());

// Test database connection
app.get("/", async (req, res) => {
    try {
        await db.execute("SELECT 1");
        res.json({
            message: "Backend is connected to Turso!"
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

// User routes
app.use("/api/users", userRoutes);

// ONLY listen on port if running locally
if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

// CRUCIAL FOR VERCEL: Export the express app
module.exports = app;