const mongoose = require("mongoose")
const Schema = mongoose.Schema

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    taskId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Comment", commentSchema)