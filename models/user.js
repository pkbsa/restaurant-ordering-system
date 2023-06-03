var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs')

var userSchema = new Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    firstname: {type: String, required: false},
    lastname: {type: String, required: false},
    address: {type: String, required: false},
    latitude: {type: String, required: false},
    longitude: {type: String, required: false},
    mobilePhone: {type: String, required: false},
    admin: {type: Number, required: true}
});
userSchema.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
}
userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User',userSchema);