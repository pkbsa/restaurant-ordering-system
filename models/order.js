var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    cart: {type: Object, required:true},
    deliveryName: {type: String, required:true},
    deliveryAddress: {type: String, required:true},
    deliveryUrl: {type: String, required:true},
    deliveryContact: {type: String, required:true},
    paymentId: {type: String, required:true},
    paymentStatus: {type: String, required:true},
    orderStatus: {type: String, required:true},
    date: {type: String, required:true}
})

module.exports = mongoose.model('Order', schema);