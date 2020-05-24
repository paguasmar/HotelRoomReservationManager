var express = require('express');
var router = express.Router();

// Require controller modules.
var hotel_controller = require('../controllers/hotelController');
var room_type_controller = require('../controllers/room_typeController');
var reservation_controller = require('../controllers/reservationController');
var client_controller = require('../controllers/clientController');

/// HOTEL ROUTES ///

// GET catalog home page.
router.get('/', hotel_controller.index);

// GET request for one Hotel.
router.get('/hotel/:id', hotel_controller.hotel_detail);

/// ROOM TYPE ROUTES ///
router.get('/hotel/:id/room_types', room_type_controller.roomtype_list);

// GET request for seeing free room types at a certain period in time.
router.get('/hotel/:id/room_type/free', room_type_controller.roomtype_free_list);

//// GET request for seeing if room is free at a certain period in time.
router.get('/hotel/room_type/:id/free', room_type_controller.roomtype_free);

// Handle Reservation create on POST.
router.post('/hotel/room_type/:id/reservation/create', reservation_controller.reservation_create_post);

////GET request for seeing the reservations of a client by his email
router.get('/reservation/:email', client_controller.client_reservation_list);


//POST request to update client´s reservation
router.post('/hotel/room_type/reservation/update', client_controller.client_update_reservation);



module.exports = router;
