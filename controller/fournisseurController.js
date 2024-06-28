const Fournisseur = require('../models/fournisseur');
const Chauffeur = require('../models/chauffeurs');
const CreditHistory = require('../models/historique')
const asyncHandler = require('express-async-handler');
const Historique = require('../models/historique');
 require("dotenv").config();
 
const postFournisseur = asyncHandler(async (req, res) => {
   const { firstName, cin, mobile, lastName, email,address,credit } = req.body;
    const {idChauffeur} =req.params

   try {
       const existingFournisseur = await Fournisseur.findOne({ email });
       if (existingFournisseur) {
           return res.status(400).json({ success: false, message: "Fournisseur with this email already exists" });
       }
       const newFournisseur = new Fournisseur({
           firstName,
           cin,
           mobile,
           lastName,
           email,
           credit,
           address,
           photo: process.env.URLBACKEND + (req.file ? req.file.path : null)  ,
           chauffeur:idChauffeur
       }); 
        const savedFournisseur =  await newFournisseur.save() ;

        const updateChauffeur = await  Chauffeur.findByIdAndUpdate(idChauffeur,{$push:{fournisseurs:savedFournisseur }}).populate('fournisseurs')
         res.status(201).json({ success: true, data: savedFournisseur });  
   } catch (error) {
       res.status(500).json({ success: false, message: error.message });
   }
});

const getAllFournisseur = asyncHandler(async (req, res) => {
   const page = parseInt(req.query.page) || 1;
   const pageSize = parseInt(req.query.pageSize) || 10;
   const skip = (page - 1) * pageSize;
 
   try {
     const totalItems = await Fournisseur.countDocuments();
     const fournisseurs = await Fournisseur.find().skip(skip).limit(pageSize);
     res.status(200).json({ success: true, data: fournisseurs, totalItems });
   } catch (error) {
     res.status(500).json({ success: false, message: error.message });
   }
 });
 

const getFournisseurById = asyncHandler(async (req, res) => {
   const id = req.params.id;
   try {
       const fournisseur = await Fournisseur.findById(id);
       if (!fournisseur) {
           return res.status(404).json({ success: false, message: "fournisseur not found" });
       }
       res.status(200).json({ success: true, data: fournisseur });
   } catch (error) {
       res.status(500).json({ success: false, message: error.message });
   }
});
const updateFournisseur = asyncHandler(async (req, res) => {
   const id = req.params.id;
   try {
       let updatedData = { ...req.body };
        if (req.file) {
           updatedData.photo = process.env.URLBACKEND + req.file.path;
       }
       const fournisseur = await Fournisseur.findByIdAndUpdate(id, updatedData, { new: true });
       if (!fournisseur) {
           return res.status(404).json({ success: false, message: "fournisseur not found" });
       }
       res.status(200).json({ success: true, data: fournisseur });
   } catch (error) {
       res.status(500).json({ success: false, message: error.message });
   }
});


const deleteFournisseur = asyncHandler(async (req, res) => {
   const id = req.params.id;
   try {
       const fournisseur = await Fournisseur.findByIdAndDelete(id);
       const historique = await Historique.deleteMany({fournisseur : fournisseur._id})
       if (!fournisseur) {
           return res.status(404).json({ success: false, message: "fournisseur not found" });
       }
       res.status(200).json({ success: true, message: "fournisseur deleted successfully" });
   } catch (error) {
       res.status(500).json({ success: false, message: error.message });
   }
});
const searchFournisseur = asyncHandler(async (req, res) => {

   const query = req.query.query;
    const searchCriteria = {};

   if (query) {
       searchCriteria.$or = [
           { firstName: { $regex: query, $options: 'i' } },
           { lastName: { $regex: query, $options: 'i' } },
           { cin: { $regex: query, $options: 'i' } },
           { mobile: { $regex: query, $options: 'i' } },
           { email: { $regex: query, $options: 'i' } },
        ];
   }

   try {
       const fournisseur = await Fournisseur.find(searchCriteria);
       res.status(200).json({ success: true, data: fournisseur });
   } catch (error) {
       console.error('Error during search:', error);
       res.status(500).json({ success: false, message: error.message });
   }
});

const updateCredit = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const { amount, type  ,method } = req.body;  
    try {
      const fournisseur = await Fournisseur.findById(id);
      if (!fournisseur) {
        return res.status(404).json({ success: false, message: "Fournisseur not found" });
      }
  
       if (type === 'credit') {
        fournisseur.credit += amount;
      } else if (type === 'debit') {
        fournisseur.credit -= amount;
      } else {
        return res.status(400).json({ success: false, message: "Invalid type. Must be 'credit' or 'debit'" });
      }
  
       await fournisseur.save();
  
       const creditHistory = new CreditHistory({
        fournisseur: fournisseur._id,
        amount,
        method,
        type,
      });
      await creditHistory.save();
  
       fournisseur.creditHistory.push(creditHistory._id);
      await fournisseur.save();
  
      res.status(200).json({ success: true, data: fournisseur });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
  
module.exports = {updateCredit,postFournisseur ,deleteFournisseur, getAllFournisseur,getFournisseurById,updateFournisseur,searchFournisseur };
