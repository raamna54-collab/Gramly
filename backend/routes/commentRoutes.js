const express = require("express");

const Comment = require("../models/Comment");
const Post = require("../models/Post");
const authMiddleware = require("../middleware/auth");

const router = express.Router();


// GET COMMENTS FOR A POST
router.get("/post/:postId", async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        const comments = await Comment.find({
            post: req.params.postId
        })
            .populate("user", "username name avatar")
            .sort({ createdAt: 1 });

        res.json(comments);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch comments",
            error: error.message
        });
    }
});


// ADD COMMENT
router.post("/post/:postId", authMiddleware, async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({
                message: "Comment text is required"
            });
        }

        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        const comment = await Comment.create({
            post: req.params.postId,
            user: req.user.id,
            text: text.trim()
        });

        const populatedComment = await comment.populate(
            "user",
            "username name avatar"
        );

        res.status(201).json({
            message: "Comment added successfully",
            comment: populatedComment
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to add comment",
            error: error.message
        });
    }
});


// DELETE COMMENT
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({
                message: "Comment not found"
            });
        }

        if (comment.user.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You can only delete your own comment"
            });
        }

        await comment.deleteOne();

        res.json({
            message: "Comment deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete comment",
            error: error.message
        });
    }
});


module.exports = router;