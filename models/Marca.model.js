const { Schema, model } = require("mongoose");

const marcaSchema = new Schema(
  {
    name: String,
    description: String,
    modelo: [{type: Schema.Types.ObjectId, ref: "Modelo"}]
  },
  {
    timestamps: true,
  }
);

module.exports = model("Marca", marcaSchema);
