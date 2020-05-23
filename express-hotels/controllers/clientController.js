var Hotel = require('../models/hotel');
var RoomType = require('../models/room_type');
var Reservation = require('../models/reservation');
require('../models/hotel');
const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');


// Display list of all RoomTypes for a Hotel.
exports.client_reservation_list = function(req, res) {

    Reservation.find({ 'email' : req.params.email })
    .populate({path:'room_type', populate:{
        path:'hotel',
        select:'name'
    }})
    .exec(function (err, reservations) {
      for(let i = 0; i < reservations.length; i++){
        RoomType.findById(reservations[i].room_type._id)
          .populate({path: 'hotel', select: 'name'})
          .exec(function(err,room_type){
          //posso continuar a escrever? se tiver algo mal diz
            if(err)
              res.json({ title: 'Reservation List', error: err});
            reservations[i].room_type = room_type; 
          });
        }  
        res.json({ title: 'Reservation List', error: err, reservation_list: reservations});
      });
};