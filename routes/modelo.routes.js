const express = require('express');
const router = express.Router();
const Modelo = require("../models/Modelo.model"); // Asegúrate de que la ruta sea correcta
const Marca = require("../models/Marca.model")
const mongoose = require("mongoose");


router.post("/:marcaId/create", async (req, res) => {
    const { marcaId } = req.params;
    const { nombre, year } = req.body;

    try {
    
        const modeloExistente = await Modelo.findOne({ nombre, year });
        if (modeloExistente) {
            return res.status(409).json({ success: false, message: "El modelo ya existe." });
        }

        const nuevoModelo = new Modelo({ nombre, year });
        await nuevoModelo.save();

        const marca = await Marca.findById(marcaId);
        if (!marca) {
            
            await Modelo.findByIdAndDelete(nuevoModelo._id);
            return res.status(404).json({ success: false, message: "Marca no encontrada." });
        }

        
        marca.modelo.push(nuevoModelo._id);
        await marca.save(); 
        res.status(201).json({ success: true, message: "Modelo creado y asignado a la marca con éxito.", modelo: nuevoModelo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error al crear el modelo o asignarlo a la marca.", error: error.message });
    }
});

router.put("/:modeloId/edit", async (req, res) => {
    const { modeloId } = req.params; 
    const { nombre, year } = req.body; 

    try {
        const modelo = await Modelo.findById(modeloId);
        if (!modelo) {
            return res.status(404).json({ success: false, message: "Modelo no encontrado." });
        }

        const modeloExistente = await Modelo.findOne({
            _id: { $ne: modeloId },
            nombre,
            year
        });

        if (modeloExistente) {
            return res.status(409).json({ success: false, message: "Ya existe otro modelo con el mismo nombre y año." });
        }

        modelo.nombre = nombre ?? modelo.nombre; 
        modelo.year = year ?? modelo.year; 
        await modelo.save();

        res.status(200).json({ success: true, message: "Modelo actualizado con éxito.", modelo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error al actualizar el modelo.", error: error.message });
    }
});

router.delete("/:modeloId/delete", async (req, res) => {
    const { modeloId } = req.params;

    try {
       
        const modelo = await Modelo.findByIdAndDelete(modeloId);
        if (!modelo) {
            return res.status(404).json({ success: false, message: "Modelo no encontrado." });
        }

        await Marca.updateMany(
            { modelo: modeloId },
            { $pull: { modelo: modeloId } }
        );

        res.status(200).json({ success: true, message: "Modelo borrado con éxito y referencias eliminadas de las marcas." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error al borrar el modelo y actualizar las marcas.", error: error.message });
    }
});

router.get("/:marcaId/findAllModelsInBrand", async (req, res) => {
    const { marcaId } = req.params;

    try {
        const marcaConModelos = await Marca.findById(marcaId).populate('modelo');
        if (!marcaConModelos) {
            return res.status(404).json({ success: false, message: "Marca no encontrada." });
        }

        res.status(200).json({ success: true, modelos: marcaConModelos.modelo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error al buscar los modelos de la marca.", error: error.message });
    }
});

router.get("/:marcaId/:modeloId/findOneModel", async (req, res) => {
    const { marcaId, modeloId } = req.params;

    try {
        const marca = await Marca.findById(marcaId).populate('modelo');
        if (!marca) {
            return res.status(404).json({ success: false, message: "Marca no encontrada." });
        }

        const modelo = marca.modelo.find(m => m._id.toString() === modeloId);
        if (!modelo) {
            return res.status(404).json({ success: false, message: "Modelo no encontrado en la marca." });
        }

        res.status(200).json({ success: true, modelo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error al buscar el modelo en la marca.", error: error.message });
    }
});


module.exports = router;