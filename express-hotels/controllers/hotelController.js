var Hotel = require('../models/hotel');
var RoomType = require('../models/room_type');
var async = require('async');

// Display index page with list of all Hotels and random image per Hotel.
exports.index = function(req, res) {

    Hotel.find({}, 'name images')
        .exec(function (err, hotels) {

            let new_hotels = [];
            // replace images array with random element
            for (let i = 0; i < hotels.length; i++) {
                var randomIndex = Math.floor(Math.random() * hotels[i].images.length);
                new_hotels[i] = {
                    _id: hotels[i]._id,
                    name: hotels[i].name,
                    image: hotels[i].images[randomIndex]
                };
            }
            res.json({ title: 'Hotels Home', error : err, hotel_list: new_hotels });
        });
};

// Display detail page for a specific Hotel.
exports.hotel_detail = function(req, res, next) {

    async.parallel({
        hotel: function(callback) {
            Hotel.findById(req.params.id)
              .exec(callback)
        },
        hotel_rooms: function(callback) {
          RoomType.find({ 'hotel' : req.params.id },'price_high_epoch price_low_epoch')
          .exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.hotel==null) { // No results.
            var err = new Error('Hotel not found');
            err.status = 404;
            return next(err);
        }
        
        //get lowest room price of this hotel
        let lowerPrice = null;
        for (let i = 0; i < results.hotel_rooms.length; i++) {
            const room = results.hotel_rooms[i];
            if (lowerPrice == null || room.price_low_epoch < lowerPrice)
                lowerPrice = room.price_low_epoch;
            
            if (room.price_high_epoch < lowerPrice)
                lowerPrice = room.price_high_epoch;
        }
        	//clones hotel
	    let hotel = JSON.parse(JSON.stringify(results.hotel))
        hotel.lower_price = lowerPrice;

        res.json({ title: 'Hotel Details', error : err, hotel: hotel });
    });
    
};