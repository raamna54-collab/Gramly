const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        caption: {
            type: String,
            default: "",
            trim: true
        },

        image: {
            type: String,
            default: ""
        },

        // ADDED: background color/gradient save hoga
        background: {
            type: String,
            default: "linear-gradient(135deg,#7c3aed,#ec4899)"
        },

        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Post", postSchema);