const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            require: true,
        },

        title: {
            type: String,
            require: true,
        },

        desc: {
            type: String,
            require: true,
        },

        img: {
            type: String,
            require: false,
            default: "",
        },

        author : {
            type : String,
            require : true,
        }
    },

    { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
