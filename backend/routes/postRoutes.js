const express = require("express");

const Post = require("../models/Post");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

const router = express.Router();


// ==========================================
// GET ALL POSTS
// ==========================================

router.get("/", async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("user", "-password")
            .populate("likes", "username name avatar")
            .sort({ createdAt: -1 });

        res.json(posts);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch posts",
            error: error.message
        });
    }
});


// ==========================================
// CREATE POST
// ==========================================

router.post("/", authMiddleware, async (req, res) => {
    try {
        const { caption, image,background } = req.body;

        if (!caption && !image) {
            return res.status(400).json({
                message: "Post must have a caption or image"
            });
        }

        const post = await Post.create({
    user: req.user.id,
    caption: caption || "",
    image: image || "",
    background:
        background ||
        "linear-gradient(135deg,#7c3aed,#ec4899)"
});

        const populatedPost = await post.populate(
            "user",
            "-password"
        );

        res.status(201).json({
            message: "Post created successfully",
            post: populatedPost
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create post",
            error: error.message
        });
    }
});


// ==========================================
// GET SINGLE POST
// ==========================================

router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate("user", "-password")
            .populate("likes", "username name avatar");

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        res.json(post);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch post",
            error: error.message
        });
    }
});


// ==========================================
// DELETE POST
// ==========================================

router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        if (post.user.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You can only delete your own post"
            });
        }

        await post.deleteOne();

        res.json({
            message: "Post deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete post",
            error: error.message
        });
    }
});


// ==========================================
// LIKE POST
// ==========================================

router.post("/:id/like", authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        if (post.likes.includes(req.user.id)) {
            return res.status(400).json({
                message: "Post already liked"
            });
        }

        post.likes.push(req.user.id);

        await post.save();

        res.json({
            message: "Post liked successfully",
            likesCount: post.likes.length
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to like post",
            error: error.message
        });
    }
});


// ==========================================
// UNLIKE POST
// ==========================================

router.delete("/:id/like", authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        post.likes = post.likes.filter(
            id => id.toString() !== req.user.id
        );

        await post.save();

        res.json({
            message: "Post unliked successfully",
            likesCount: post.likes.length
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to unlike post",
            error: error.message
        });
    }
});


module.exports = router;