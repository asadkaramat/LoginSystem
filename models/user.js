var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var User = new Schema({
    name: {
        firstName: String,
        lastName: String
    },
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    email: { type: String, required: true, index: true },
    registeredAt: { type: Date, default: Date.now }
});

User.virtual('name.fullName').get(function () {
    return this.name.firstName + ' ' + this.name.lastName; 
});

module.exports = mongoose.model('User', User);