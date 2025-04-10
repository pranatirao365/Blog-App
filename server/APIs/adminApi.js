const exp = require("express");
const UserAuthor = require("../models/userAuthorModel");
const adminApp = exp.Router();


adminApp.get("/admins", async (req, res) => {
    try {
      const admins = await UserAuthor.find({ role: "admin" }, "email"); // Fetch only admins
      res.json(admins.map(admin => admin.email)); // Send only email array
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  });


// Get all Users
adminApp.get("/users",  async (req, res) => {
    try {
        const users = await UserAuthor.find({ role:  "user" }); // Exclude admins
        res.json({ message: "Users fetched successfully", payload: users });
    } catch (err) {
        res.status(500).json({ message: "Error fetching users", error: err.message });
    }
});

// Get all  Authors 
adminApp.get("/authors",  async (req, res) => {
    try {
        const users = await UserAuthor.find({ role: "author" }); // Exclude admins
        res.json({ message: "Users fetched successfully", payload: users });
    } catch (err) {
        res.status(500).json({ message: "Error fetching users", error: err.message });
    }
});

// Enable or disable a User/Author
adminApp.put("/toggle-status/:id",  async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserAuthor.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Toggle isActive status
        user.isActive = !user.isActive;
        await user.save();

        const statusMessage = user.isActive ? "enabled" : "blocked";
        res.json({ message: `User ${statusMessage} successfully`, payload: user });
    } catch (err) {
        res.status(500).json({ message: "Error updating status", error: err.message });
    }
});

module.exports = adminApp;
