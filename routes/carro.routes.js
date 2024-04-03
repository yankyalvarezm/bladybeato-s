const express = require("express");
const router = express.Router();
const Marca = require("../models/Marca.model");
const Modelo = require("../models/Modelo.model");
const Carro = require("../models/Carro.model");
const mongoose = require("mongoose");
const fileUploader = require("../configs/cloudinary.config");

router.post("/create", fileUploader.array("image", 8), async (req, res) => {
  console.log("req.files:", req.files);

  if (!req.files || !req.files.length) {
    console.error("Error: No File Provided");
    return res
      .status(500)
      .json({ success: false, message: "Error: No Image Provided" });
  }
  const { marcaId, modeloId, vendido, usado, cantidad, kilometraje, precio } =
    req.body;

  try {
    const marca = await Marca.findById(marcaId);
    if (!marca) {
      return res
        .status(404)
        .json({ success: false, message: "Marca no encontrada." });
    }

    const esModeloDeMarca = marca.modelo.some(
      (id) => id.toString() === modeloId
    );
    if (!esModeloDeMarca) {
      return res.status(404).json({
        success: false,
        message: "Modelo no encontrado en la marca indicada.",
      });
    }

    const imagenes = req.files.map((file) => file.path);

    const nuevoCarro = new Carro({
      marca: marcaId,
      modelo: modeloId,
      imagenes,
      vendido,
      usado,
      cantidad,
      kilometraje,
      precio,
    });

    // nuevoCarro.imagenes.push(req.file.path);

    await nuevoCarro.save();

    const carroPopulado = await Carro.findById(nuevoCarro._id)
      .populate("marca", "name")
      .populate("modelo", "nombre");

    res.status(201).json({
      success: true,
      message: "Carro creado con éxito.",
      carro: carroPopulado,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error al crear el carro.",
      error: error.message,
    });
  }
});

router.patch("/:carroId/edit", async (req, res) => {
  const { carroId } = req.params;
  const { marcaId, modeloId, imagenes, nuevo, usado, cantidad, kilometraje } =
    req.body;

  try {
    const carro = await Carro.findById(carroId);
    if (!carro) {
      return res
        .status(404)
        .json({ success: false, message: "Carro no encontrado." });
    }

    if (marcaId) {
      const marca = await Marca.findById(marcaId);
      if (!marca) {
        return res
          .status(404)
          .json({ success: false, message: "Marca no encontrada." });
      }

      if (modeloId) {
        const esModeloDeMarca = marca.modelo.some(
          (id) => id.toString() === modeloId
        );
        if (!esModeloDeMarca) {
          return res.status(404).json({
            success: false,
            message: "Modelo no encontrado en la marca indicada.",
          });
        }
      }
      carro.marca = marcaId;
    }

    if (modeloId) carro.modelo = modeloId;
    if (imagenes) carro.imagenes = imagenes;
    if (nuevo !== undefined) carro.nuevo = nuevo;
    if (usado !== undefined) carro.usado = usado;
    if (cantidad !== undefined) carro.cantidad = cantidad;
    if (kilometraje !== undefined) carro.kilometraje = kilometraje;

    await carro.save();

    res
      .status(200)
      .json({ success: true, message: "Carro actualizado con éxito.", carro });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar el carro.",
      error: error.message,
    });
  }
});

router.delete("/:carroId/delete", async (req, res) => {
  const { carroId } = req.params;

  try {
    const carroBorrado = await Carro.findByIdAndDelete(carroId);
    if (!carroBorrado) {
      return res
        .status(404)
        .json({ success: false, message: "Carro no encontrado." });
    }
    res
      .status(200)
      .json({ success: true, message: "Carro borrado con éxito." });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error al borrar el carro.",
      error: error.message,
    });
  }
});

router.get("/:marcaId/findAll", async (req, res) => {
  const { marcaId } = req.params;

  try {
    const carros = await Carro.find({ marca: marcaId }).populate("marca");
    res.status(200).json({ success: true, carros });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error al obtener los carros de la marca.",
      error: error.message,
    });
  }
});

router.get("/:carroId/find", async (req, res) => {
  console.log("EndPoint Hit");
  const { carroId } = req.params;

  try {
    const carro = await Carro.findById(carroId)
      .populate("marca", "name")
      .populate("modelo", "nombre year");

    console.log("carro:", carro);

    if (!carro) {
      console.log("no carro found");
      return res
        .status(404)
        .json({ success: false, message: "Carro no encontrado." });
    }
    return res.status(200).json({ success: true, carro });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error al obtener el carro.",
      error: error.message,
    });
  }
});

router.get("/findAll", async (req, res) => {
  try {
    const carros = await Carro.find()
      .populate("marca", "name")
      .populate("modelo", "nombre");

    console.log("carros:", carros);

    return res.status(200).json({ success: true, carros });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error al obtener todos los carros.",
      error: error.message,
    });
  }
});

module.exports = router;
