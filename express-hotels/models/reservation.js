var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ReservationSchema = new Schema({
    name: { type: String, required: true, max: 100 },
    price: {type: Number, required: true },
    begin_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    email: { type: String, required: true},
    card_number: { type: Number },
    telephone: { type: Number },
    address: { type: String },
    nif: { type: Number },
    room_type: {type: Schema.ObjectId, ref: 'Room_Type', required: true}
});

// Virtual for author's URL
ReservationSchema
.virtual('url')
.get(function () {
  return '/catalog/reservation/' + this._id;
});


// Export model.
module.exports = mongoose.model('Reservation', ReservationSchema);