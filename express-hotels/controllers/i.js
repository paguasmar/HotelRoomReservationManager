var RoomService = require('../models/room_service');
var RoomType = require('../models/room_type');
var Reservation = require('../models/reservation');
require('../models/hotel');
const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var async = require('async');

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
  var cont = 0;
  const date1 = new Date(req.query.beginDate);
  const date2 = new Date(req.query.endDate);
  var free_list = [];
  async.waterfall([

    function(callback){
      RoomType.find({ 'hotel' : req.params.id })
      .populate('services')
      .populate({path: 'hotel', select: 'name'})
      .exec(function(err, room_types){
        callback(null,room_types); // podes mexer sim!
      }) // BORA TENTAR
    },

    function(room_types, callback){
      var listFunc = [];
      for (let i = 0; i < room_types.length; i++) {
        listFunc.push(
          function(callback){
            Reservation.find({'room_type' : room_types[i]._id}, 'begin_date end_date')
            .exec(callbackParallel);
          }
        );
      }
      /*
      function(err, reservations){
              if(hasAvailableRoomsAt(room_types[i],reservations,date1,date2)) {
                free_list.push(room_types[i]);
              }
            }
      */
      async.parallel(
        listFunc, 
        function(err, results) {
          if (err) { return next(err); } // Error in API usage.
          if (results.author==null) { // No results.
              var err = new Error('Author not found');
              err.status = 404;
              return next(err);
          }
          // Successful, so render.
          res.render('author_detail', { title: 'Author Detail', author: results.author, author_books: results.authors_books } );
      }

      )
      callback(null,free_list);
    }
  ],function(err,result){
    res.json({ title: 'Free Room Type List', error: err, room_type_free_list: result});
  });
};

function hasAvailableRoomsAt(room_type,reservations,beginDate, endDate){
  let res = room_type.number_of_rooms;
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
}

// receives a room type id and 2 dates
// returns if room is free or not
exports.roomtype_free = function(req, res) {
  const date1 = new Date(req.query.dateBegin);
  const date2 = new Date(req.query.dateEnd);

  Reservation.find({'room_type' : req.params.id}, 'begin_date end_date')
  .exec(function(err, reservations){
    let collision = false;
    for (let j = 0; j < reservations.length; j++) {                                    //(r1,r2 timeframe of the reservation  | d1,d2 timeframe of the given time)
      if ((reservations[j].begin_date <= date1 && reservations[j].end_date >= date1) ||//   r1-----d1-----r2 
          (reservations[j].begin_date <= date2 && reservations[j].end_date >= date2) ||//   r1-----d2-----r2
          (reservations[j].begin_date >= date1 && reservations[j].end_date <= date2) ){// d1-----r1-----r2-----d2
          collision = true;
          break;
      }
      
    }
    if (!collision) {
      res.json({ title: 'Free Room Type', error: err, room_type_free: true});
    }else{
      res.json({ title: 'Free Room Type', error: err, room_type_free: false});
    }
  });
  //David acho que foste tu que tiveste a fazer vou deixar para caso de nâo usares o que fiz ou não der certo
  // // Validate fields.
  // body('begin_date', 'Invalid date').optional({ checkFalsy: true }).isISO8601(),
  // body('end_date', 'Invalid date').optional({ checkFalsy: true }).isISO8601(),  
  // // Sanitize fields.
  // sanitizeBody('end_date').toDate(),
  // sanitizeBody('begin_date').toDate(),
  // Reservation.find({room_type: req.params.id})
  //   .populate('room_type')
  //   .populate('hotel')
  //   .exec(function (err, reservations) {
  //     res.json('hey5')
  //     var res = [];
  //     for(let i = 0; i < reservations.length; i++){
  //       if(reservations[i].begin_date >= req.body.begin_date && eservations[i].end_date <= req.body.end_date)
  //         res.push(reservations[i]);
  //     }
  //     res.json({ title: 'Room Type List', error: err, room_type_list: res});
  //   });
    /*
  RoomType.findById(req.params.id)
  .populate('services')
  .populate({path: "hotel",select:"name"})
  .exec(function (err, room) {
      for(let i = 0; i < )
      res.json({ title: 'Reservar quarto de hotel', error: err, room_type: room});
    });
    */
};
