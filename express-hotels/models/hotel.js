var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var HotelSchema = new Schema({
    name: { type: String, required: true, max: 100 },
    description: { type: String },
    adress: {type: String, required: true },
    coordinates: {type: String, required: true},
    phoneNumber: {
        id:{type: Number , min: 0 , max: 999},
        number: {type: Number, min: 200000000, max:999999999} 
    },
    email: {type: String, required: true},
    images: [{type: String}],
    services: [{type: String}]

});

// Export model.
module.exports = mongoose.model('Hotel', HotelSchema);