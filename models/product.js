var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var additionalChoiceSchema = new Schema({
    title: { type: String, required: true },
    choices: [{ type: String, required: true }],
    prices: [{ type: Number, required: true }]
});

var productSchema = new Schema({
    imagePath: { type: [String], required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    status: { type: String, required: true },
    additionalChoices: [additionalChoiceSchema]
});

module.exports = mongoose.model('Product', productSchema);