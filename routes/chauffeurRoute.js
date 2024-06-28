const express = require('express');
const router = express.Router();
const upload = require('../config/multer'); 
const ChauffeurController = require('../controller/chauffeurController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
router.get('/allChauf', ChauffeurController.getAll);
router.get('/search', ChauffeurController.searchChauffeurs);
router.post('/', upload.single('photo'), ChauffeurController.postChauffeur);
router.get('/',authMiddleware,isAdmin, ChauffeurController.getAllChauffeurs);
router.get('/:id',authMiddleware,isAdmin ,ChauffeurController.getChauffeurById);
router.patch('/:id',authMiddleware,isAdmin, upload.single('photo') ,ChauffeurController.updateChauffeur);
router.delete('/:id',authMiddleware,isAdmin, ChauffeurController.deleteChauffeur);

module.exports = router;
