const express = require('express');
const router = express.Router();
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
 const creditHistoryController = require('../controller/historiqueController');
 router.get('/search',  authMiddleware,isAdmin, creditHistoryController.searchCreditHistoryByQuery);
 router.get('/',  authMiddleware,isAdmin, creditHistoryController.getAllCreditHistory);
router.get('/by-date',  authMiddleware,isAdmin, creditHistoryController.getCreditHistoryByDate);
router.delete('/:id',  authMiddleware,isAdmin, creditHistoryController.deleteHistory);

 module.exports = router;
