const express = require('express');
const router = express.Router();
const upload = require('../config/multer'); 
const fournisseurController = require('../controller/fournisseurController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

router.get('/search', fournisseurController.searchFournisseur);
router.post('/:idChauffeur', upload.single('photo'), fournisseurController.postFournisseur);
router.get('/',authMiddleware,isAdmin, fournisseurController.getAllFournisseur);
router.get('/:id',authMiddleware,isAdmin ,fournisseurController.getFournisseurById);
router.patch('/:id',authMiddleware,isAdmin, upload.single('photo') ,fournisseurController.updateFournisseur);
router.delete('/:id',authMiddleware,isAdmin, fournisseurController.deleteFournisseur);
router.patch('/credit/:id',authMiddleware,isAdmin  ,fournisseurController.updateCredit);

module.exports = router;
