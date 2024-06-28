   const Chauffeur = require('../models/chauffeurs');
 const asyncHandler = require('express-async-handler');
 require("dotenv").config();

 const postChauffeur = asyncHandler(async (req, res) => {
    const { firstName, cin, mobile, lastName, email, transportName, transportSerie } = req.body;
    try {
        const existingChauffeur = await Chauffeur.findOne({ email });
        if (existingChauffeur) {
            return res.status(400).json({ success: false, message: "Chauffeur with this email already exists" });
        }
        const newChauffeur = new Chauffeur({
            firstName,
            cin,
            mobile,
            lastName,
            email,
            transportName,
            transportSerie,
            photo:   (req.file ? process.env.URLBACKEND+req.file.path : null)  
        }); 
        console.log(req.body)
        const savedChauffeur = await newChauffeur.save();
        console.log(savedChauffeur)
        res.status(201).json({ success: true, data: savedChauffeur });  
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

const getAll = asyncHandler(async (req, res) => {
    try {
      const chauffeurs = await Chauffeur.find();
      res.status(200).json({ success: true, data: chauffeurs  });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
  const getAllChauffeurs = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;
  
    try {
      const totalItems = await Chauffeur.countDocuments();
      const chauffeurs = await Chauffeur.find().skip(skip).limit(pageSize);
      res.status(200).json({ success: true, data: chauffeurs, totalItems });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
  

const getChauffeurById = asyncHandler(async (req, res) => {
    const id = req.params.id;
    try {
        const chauffeur = await Chauffeur.findById(id).populate('fournisseurs');
        if (!chauffeur) {
            return res.status(404).json({ success: false, message: "Chauffeur not found" });
        }
        res.status(200).json({ success: true, data: chauffeur });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
const updateChauffeur = asyncHandler(async (req, res) => {
    const id = req.params.id;
    try {
        let updatedData = { ...req.body };
         if (req.file) {
            updatedData.photo = process.env.URLBACKEND + req.file.path;
        }
        const chauffeur = await Chauffeur.findByIdAndUpdate(id, updatedData, { new: true });
        if (!chauffeur) {
            return res.status(404).json({ success: false, message: "Chauffeur not found" });
        }
        res.status(200).json({ success: true, data: chauffeur });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


const deleteChauffeur = asyncHandler(async (req, res) => {
    const id = req.params.id;
    try {
        const chauffeur = await Chauffeur.findByIdAndDelete(id);
        if (!chauffeur) {
            return res.status(404).json({ success: false, message: "Chauffeur not found" });
        }
        res.status(200).json({ success: true, message: "Chauffeur deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
const searchChauffeurs = asyncHandler(async (req, res) => {
 
    const query = req.query.query;
     const searchCriteria = {};

    if (query) {
        searchCriteria.$or = [
            { firstName: { $regex: query, $options: 'i' } },
            { lastName: { $regex: query, $options: 'i' } },
            { cin: { $regex: query, $options: 'i' } },
            { mobile: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } },
            { transportName: { $regex: query, $options: 'i' } },
            { transportSerie: { $regex: query, $options: 'i' } },
        ];
    }

    try {
        const chauffeurs = await Chauffeur.find(searchCriteria);
        res.status(200).json({ success: true, data: chauffeurs });
    } catch (error) {
        console.error('Error during search:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = {getAll,searchChauffeurs,postChauffeur, deleteChauffeur,updateChauffeur , getChauffeurById ,getAllChauffeurs};
