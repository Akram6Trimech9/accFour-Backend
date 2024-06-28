const mongoose = require('mongoose');

const creditHistorySchema = new mongoose.Schema({
    fournisseur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fournisseur',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    method: {
        type: String,
        enum: ['espece', 'cheque'],
     },
    type: {
        type: String,
        enum: ['credit', 'debit'],
        required: true,
    }
 
}, {
    timestamps: true
}); 
module.exports = mongoose.model('CreditHistory', creditHistorySchema);