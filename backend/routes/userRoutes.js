const express = require("express");

const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

const router = express.Router();


// ==========================================
// GET ALL USERS
// ==========================================

router.get("/", async (req, res) => {
    try {
        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.json(users);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch users",
            error: error.message
        });
    }
});


// ==========================================
// GET SINGLE USER PROFILE
// ==========================================

router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(user);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch user",
            error: error.message
        });
    }
});


// ==========================================
// UPDATE MY PROFILE
// ==========================================

router.put("/profile/update", authMiddleware, async (req, res) => {
    try {
        const { name, bio, avatar } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (name !== undefined) {
            user.name = name;
        }

        if (bio !== undefined) {
            user.bio = bio;
        }

        if (avatar !== undefined) {
            user.avatar = avatar;
        }

        await user.save();

        res.json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                username: user.username,
                name: user.name,
                email: user.email,
                bio: user.bio,
                avatar: user.avatar
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update profile",
            error: error.message
        });
    }
});


// ==========================================
// FOLLOW USER
// ==========================================

router.post("/:id/follow", authMiddleware, async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
        const targetUser = await User.findById(req.params.id);

        if (!currentUser || !targetUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (currentUser._id.equals(targetUser._id)) {
            return res.status(400).json({
                message: "You cannot follow yourself"
            });
        }

        if (currentUser.following.includes(targetUser._id)) {
            return res.status(400).json({
                message: "Already following this user"
            });
        }

        currentUser.following.push(targetUser._id);
        targetUser.followers.push(currentUser._id);

        await currentUser.save();
        await targetUser.save();

        res.json({
            message: "User followed successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to follow user",
            error: error.message
        });
    }
});


// ==========================================
// UNFOLLOW USER
// ==========================================

router.delete("/:id/follow", authMiddleware, async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
        const targetUser = await User.findById(req.params.id);

        if (!currentUser || !targetUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        currentUser.following =
            currentUser.following.filter(
                id => !id.equals(targetUser._id)
            );

        targetUser.followers =
            targetUser.followers.filter(
                id => !id.equals(currentUser._id)
            );

        await currentUser.save();
        await targetUser.save();

        res.json({
            message: "User unfollowed successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to unfollow user",
            error: error.message
        });
    }
});


module.exports = router;