var RoomService = require('../models/room_service');
var RoomType = require('../models/room_type');
var Reservation = require('../models/reservation');
require('../models/hotel');
const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');


// Display list of all RoomTypes for a Hotel.
exports.roomtype_list = function(req, res) {

    RoomType.find({ 'hotel' : req.params.id })
    .populate('services')
    .populate({path: "hotel",select:"name"})
    .exec(function (err, room_types) {

        let standardRoom = room_types.find(r => { return r.name == "Quarto Standard"});

        res.json({ title: 'Room Type List', error: err, room_type_list: room_types, standard_services: standardRoom.services});
      });
};

// receives a hotel id and two dates
// returns a list of free roomtypes of an hotel
exports.roomtype_free_list = function(req, res) {
  const date1 = new Date(req.query.beginDate);
  const date2 = new Date(req.query.endDate);

  var free_map = new Map();
  var free_list = [];
  Reservation.find()
      .populate({path:'room_type', populate:{
        path:'services'
      }})
      .exec(function(err,reservations){
	      var resservations_list = [];
        for(let i = 0; i < reservations.length; i++){
            if(!(reservations[i].room_type in free_map))
              free_map.set(reservations[i].room_type,[]);
            free_map.get(reservations[i].room_type).push(reservations[i]);
        }
    keys = Array.from(free_map.keys());
    for(let i = 0; i < keys.length; i++){
      if(hasAvailableRoomsAt(keys[i],free_map.get(keys[i]).reservations,date1,date2))
        free_list.push(keys[i]);
    }
    console.log(result);
    res.json({ title: 'Free Room Type List', error: err, room_type_free_list: free_list});
   });
};


/*export*/ function hasAvailableRoomsAt(room_type,reservations,beginDate, endDate){
  let res = room_type.number_of_rooms;
console.log(res);
  for(let i = 0; i < reservations.length; i++){
    let reservation_begin = reservations[i].begin_date;
    let reservation_end = reservations[i].end_date;
    if( (reservation_begin >= beginDate && reservation_end <= endDate) || //d1---r1---r2---d2
        (reservation_begin >= beginDate && reservation_begin <= endDate) || //d1----r1--d2--r2
        (reservation_end >= beginDate && reservation_end <= endDate) ||  //r1---d1---r2----d2
        (reservation_begin <= beginDate && reservation_end >= endDate) //r1---d1-----d2----r2
        ){
          res--;
       }
  }
  return res > 0;
};

// receives a room type id and 2 dates
// returns if room is free or not
exports.roomtype_free = function(req, res) {
  const date1 = new Date(req.query.beginDate);
  const date2 = new Date(req.query.endDate);

  Reservation.find({'room_type' : {'_id': req.params.id}})
	.populate('room_type')
  .exec(function(err, reservations){
	if(reservations.length == 0){
		res.json({title: 'Free Room Type', error: err, result: true});
		return;
	}
	console.log(hasAvailableRoomsAt(reservations[0].room_type,reservations,date1,date2));
    res.json({ title: 'Free Room Type', error: err, result: hasAvailableRoomsAt(reservations[0].room_type,reservations,date1,date2)});
  });
};
