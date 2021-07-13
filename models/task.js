const mongoose = require("mongoose")
const Schema = mongoose.Schema

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: Number,
      required: true
    },
    userId: {
      type: String,
      required: true,
    },
    parentId: {
      type: String
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Task", taskSchema)