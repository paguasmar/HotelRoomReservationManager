var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Room_TypeSchema = new Schema({
    hotel:{type: Schema.ObjectId, ref: 'Hotel', required: true},
    name: {type: String ,required:true},
    price_high_epoch: Number,
    price_low_epoch: Number,
    number_of_rooms: Number,
    services:[{type: Schema.ObjectId, ref: 'RoomService'}]
});

// Export model.
module.exports = mongoose.model('Room_Type', Room_TypeSchema);