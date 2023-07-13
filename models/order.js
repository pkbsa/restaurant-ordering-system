var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    cart: {type: Object, required:true},
    tip: {type: String, required:true},
    tax: {type: String, required:true},
    totalPrice:  {type: String, required:true},
    deliveryType: {type: String, required:true},
    deliveryName: {type: String, required:true},
    deliveryAddress: {type: String, required:true},
    deliveryUrl: {type: String, required:true},
    deliveryContact: {type: String, required:true},
    paymentId: {type: String, required:true},
    paymentIntentId: {type: String, required:false},
    refundId: {type: String, required:false},
    paymentStatus: {type: String, required:true},
    orderStatus: {type: String, required:true},
    orderEta: {type: String, required:false},
    date: {type: String, required:true}
})

module.exports = mongoose.model('Order', schema);