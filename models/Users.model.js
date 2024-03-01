const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: {type: String, required: true, trim: true},
    email: {type: String, unique: true, required: true, trim: true},
    password: {type: String, required: true},
    isAdmin: {type:Boolean, default: false},
  },
  {
    timestamps: true,
  }
);

module.exports = model("Users", userSchema);
