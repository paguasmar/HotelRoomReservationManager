var RoomType = require('../models/room_type');
var Reservation = require('../models/reservation');
//import { hasAvailableRoomsAt } from './hasAvailableRoomsAt';
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Handle BookInstance create on POST.
exports.reservation_create_post = [

  // Validate fields.
  body('price', 'Price must be specified').isNumeric(),
  body('begin_date', 'Invalid begin date').isISO8601(),
  body('end_date', 'Invalid end date').isISO8601(),
  body('email', 'Invalid email').isEmail(),
  body('card_number', 'Card number must be numeric').optional({ checkFalsy: true }).isNumeric(),
  body('telephone', 'Telephone number must be numeric').optional({ checkFalsy: true }).isNumeric(),
  body('nif', 'NIF must be numeric').optional({ checkFalsy: true }).isNumeric(),
  
  // Sanitize fields.
  sanitizeBody('price').toInt(),
  sanitizeBody('begin_date').toDate(),
  sanitizeBody('end_date').toDate(),
  sanitizeBody('email').normalizeEmail(),
  sanitizeBody('card_number').toInt(),
  sanitizeBody('telephone').toInt(),
  sanitizeBody('nif').toInt(),
  
  // Process request after validation and sanitization.
  (req, res, next) => {
	console.log(req.body.price);

      // Extract the validation errors from a request.
      const errors = validationResult(req);

      // Create a BookInstance object with escaped and trimmed data.
      var reservation = new Reservation(
        { name: req.body.name,
          price: req.body.price,
          begin_date: req.body.begin_date,
          end_date: req.body.end_date,
          email: req.body.email,
          card_number: req.body.card_number,
          telephone: req.body.telephone,
          address: req.body.address,
          nif: req.body.nif,
          room_type: req.params.id
         });

      if (!errors.isEmpty()) {
          // There are errors. Render form again with sanitized values and error messages.
          //res.json({ title: 'Create Reservation', selected_room_type : reservation.room_type._id , errors: errors.array(), reservation:reservation });
          res.json({ title: 'Create Reservation', result: false,errors: errors.array() });
          return;
      }
      else {
          // Data from form is valid
	      Reservation.find({'room_type':{'_id':req.params.id}}).exec(function(err,reservations){
          if(!hasAvailableRoomsAt(req.body.room_type,reservations,reservation.begin_date,reservation.end_date)){
            res.json({ title: 'Create Reservation', result: false , error:err});
            return;
          }

          reservation.save(function (err) {
              if (err) { 
                res.json({ title: 'Create Reservation', result: false , error:err});
              }else
                res.json({ title: 'Create Reservation', result: true});
              });
        })
      }
  }
];

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
};
