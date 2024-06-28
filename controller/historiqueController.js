const CreditHistory = require('../models/historique');
const asyncHandler = require('express-async-handler');

 const getAllCreditHistory = asyncHandler(async (req, res) => {
  const { page = 1, pageSize = 10, query = '', startDate, endDate } = req.query;
  const skip = (page - 1) * pageSize;

  const searchCriteria = {};

   if (query) {
    searchCriteria.$or = [
      { method: { $regex: query, $options: 'i' } },
      { type: { $regex: query, $options: 'i' } },
      { amount: { $regex: query, $options: 'i' } }
    ];
  }

   if (startDate && endDate) {
    searchCriteria.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  try {
    const totalItems = await CreditHistory.countDocuments(searchCriteria);
    const creditHistory = await CreditHistory.find(searchCriteria)
      .skip(skip)
      .limit(pageSize)
      .populate('fournisseur');
    
    res.status(200).json({ success: true, data: creditHistory, totalItems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

 const getCreditHistoryByDate = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({ success: false, message: 'Please provide both startDate and endDate' });
  }

  try {
    const creditHistory = await CreditHistory.find({
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).populate('fournisseur');
    
    res.status(200).json({ success: true, data: creditHistory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

const searchCreditHistoryByQuery = asyncHandler(async (req, res) => {
    const { query } = req.query;
    
    const searchCriteria = {};
  
    if (query) {
      searchCriteria.$or = [
        { method: { $regex: query, $options: 'i' } },
        { type: { $regex: query, $options: 'i' } },
         { 'fournisseur.name': { $regex: query, $options: 'i' } },  
        { 'fournisseur.lastName': { $regex: query, $options: 'i' } }  
      ];
    }
  
    try {
       const creditHistory = await CreditHistory.find(searchCriteria).populate('fournisseur');
       res.status(200).json({ success: true, data: creditHistory });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
});

  
const deleteHistory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
       const creditHistory = await CreditHistory.findByIdAndDelete(id) 
       res.status(200).json({ success: true, data: creditHistory });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
});
  module.exports = {
    getAllCreditHistory,
    getCreditHistoryByDate,
    searchCreditHistoryByQuery,
    deleteHistory
  };
  
 
