const express = require('express');
const router = express.Router();
const Marca = require("../models/Marca.model"); // Asegúrate de que la ruta sea correcta
const mongoose = require("mongoose");

router.post("/create", async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ success: false, message: "El nombre es requerido." });
    }

    try {
        const marcaExistente = await Marca.findOne({ name });
        if (marcaExistente) {
            return res.status(409).json({ success: false, message: "La marca ya existe." });
        }

        const nuevaMarca = new Marca({ name });
        await nuevaMarca.save();

        res.status(201).json({ success: true, message: "Marca creada con éxito.", marca: nuevaMarca });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error al crear la marca.", error: error.message });
    }
});

router.put("/edit/:id", async (req, res) => {
    const { id } = req.params;
    const { name } = req.body; 

    if (!name) {
        return res.status(400).json({ success: false, message: "El nombre es requerido para la actualización." });
    }

    try {
        
        const marca = await Marca.findById(id);
        if (!marca) {
            return res.status(404).json({ success: false, message: "Marca no encontrada." });
        }

        const marcaExistente = await Marca.findOne({ name: name, _id: { $ne: id } });
        if (marcaExistente) {
            return res.status(409).json({ success: false, message: "Ya existe otra marca con ese nombre." });
        }

        marca.name = name;
        await marca.save();

        res.status(200).json({ success: true, message: "Marca actualizada con éxito.", marca });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error al actualizar la marca.", error: error.message });
    }
});

router.delete("/delete/:id", async (req, res) => {
    const { id } = req.params; 

    try {
        const marcaBorrada = await Marca.findByIdAndDelete(id);
        if (!marcaBorrada) {
            return res.status(404).json({ success: false, message: "Marca no encontrada." });
        }

        res.status(200).json({ success: true, message: "Marca borrada con éxito." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error al borrar la marca.", error: error.message });
    }
});


router.get("/:marcaId/findOne", async (req, res) => {
    const marcaId = req.params.marcaId;

    try {
        const findMarca = await Marca.findById(marcaId)
        if(!findMarca){
            return res
          .status(404)
          .json({ success: false, message: "Marca not found." });
        }
        return res.status(201).json({ success: true, marca: findMarca });
    } catch (error) {
        res.status(400).json({ success: false, message: "Marca no encontrada" });
    }

})

router.get("/findAll", async (req, res) => {
    try {
        const findMarca = await Marca.find();
        if (!findMarca) {
            return res
          .status(404)
          .json({ success: false, message: "No tienes marcas disponibles" });
        }
        // Devuelve directamente la lista sin la propiedad 'marca'
        return res.status(201).json({ success: true, marca: findMarca });
    } catch (error) {
        res.status(400).json({ success: false, message: "Marca no encontrada" });
    }
})

module.exports = router;
