var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    opentime: {type: String, required:true},
    closetime: {type: String, required:true},
    status: {type: String, required:true}
})

module.exports = mongoose.model('Store', schema);