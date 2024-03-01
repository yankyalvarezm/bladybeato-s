const { Schema, model } = require("mongoose");

const modeloSchema = new Schema(
  {
    nombre: String,
    year: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = model("Modelo", modeloSchema);
