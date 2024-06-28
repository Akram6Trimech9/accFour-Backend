const mongoose = require('mongoose');

const chauffeurSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    cin: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, 
    },
    transportName: {
        type: String,
        required: true,
     },
     transportSerie: {
        type: String,
        required: true,
     },
    photo: {
        type: String, 
    },
    fournisseurs: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Fournisseur',
        },
      ],
 }, {
    timestamps: true
});

module.exports = mongoose.model('Chauffeur', chauffeurSchema);
