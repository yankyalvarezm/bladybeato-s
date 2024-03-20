const { Schema, model } = require("mongoose");

const carroSchema = new Schema(
  {
    marca: { type: Schema.Types.ObjectId, ref: "Marca" },
    modelo: { type: Schema.Types.ObjectId, ref: "Modelo" },
    imagenes: [{ type: String }],
    nuevo: Boolean,
    usado: Boolean,
    cantidad: Number,
    kilometraje: Number,
    precio: String,
  },
  {
    timestamps: true,
  }
);

module.exports = model("Carros", carroSchema);
