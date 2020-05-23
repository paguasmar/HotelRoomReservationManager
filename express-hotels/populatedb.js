console.log('This script populates some hotels and room types to the database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Hotel = require('./models/hotel')
var RoomService = require('./models/room_service')
var RoomType = require('./models/room_type')
var myHotelJson = require('./Data/hotels.json')
var myRoomTypeJson = require('./Data/roomTypes.json')
var myRoomServiceJson = require('./Data/roomServices.json')
var myRoomTypeRoomServiceJson = require('./Data/roomTypes_roomServices.json')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var hotels = []
var roomTypes = []
var roomServices = []

var myHotelObj = myHotelJson;
var myRoomsObj = myRoomTypeJson;
var myServicesObj = myRoomServiceJson;
var myRoomTypeRoomServiceObj = myRoomTypeRoomServiceJson;

var listHotels = myHotelObj["list"];
var listRooms = myRoomsObj["list"];
var listServices = myServicesObj["list"];
var listRoomTypeRoomService = myRoomTypeRoomServiceObj["list"];


function hotelCreate(name, description, adress, coordinates, phoneNumber, email, images, services, cb){
    hoteldetail = {name:name , description:description, adress:adress, 
                    coordinates:coordinates, phoneNumber:phoneNumber, email:email, images:images, 
                    services:services}

    var hotel = new Hotel(hoteldetail);
    
    hotel.save(function (err) {
        if (err) {
          cb(err, null)
          return
        }
        console.log('New Hotel: ' + hotel);
        hotels.push(hotel)
        console.log(hotels[hotels.length - 1]);
        cb(null, hotel)
      }  );
}

function createHotels(cb) {
    async.series(
        listOfHotelsToListOfCreateFunctions(listHotels),
        // optional callback
        cb);
}

// Pega numa lista de hotels e converte para uma lista de funcoes para o async
function listOfHotelsToListOfCreateFunctions(hotelObjs) {
    // Pega numa lista de hotels e converte para uma lista de funcoes para o async
    var myHotelCreateFunctions = hotelObjs.map(function(hotel) {
        return function(callback) {
            hotelCreate(hotel["name"], hotel["description"], hotel["adress"], hotel["coordinates"], 
                hotel["phoneNumber"], hotel["email"], hotel["images"], hotel["services"], callback);
        }
    });
    return myHotelCreateFunctions;
}

function roomServiceCreate(name, cb){
    roomServicedetail = {name:name}

    var service = new RoomService(roomServicedetail);
    
    service.save(function (err) {
        if (err) {
          cb(err, null)
          return
        }
        console.log('New Room Service: ' + service);
        roomServices.push(service)
        cb(null, service)
      }  );
}

function createRoomServices(cb) {
    async.series(
        listOfServicesToListOfCreateFunctions(listServices),
        // optional callback
        cb);
}

// Pega numa lista de hotels e converte para uma lista de funcoes para o async
function listOfServicesToListOfCreateFunctions(serviceObjs) {
    // Pega numa lista de hotels e converte para uma lista de funcoes para o async
    var myServiceCreateFunctions = serviceObjs.map(function(service) {
        return function(callback) {
            roomServiceCreate(service["name"], callback);
        }
    });
    return myServiceCreateFunctions;
}

function roomTypeCreate(hotel, name, price_high_epoch, price_low_epoch, number_of_rooms, services, cb){
    roomTypeDetail = {hotel:hotel.id, name: name, price_high_epoch:price_high_epoch, price_low_epoch:price_low_epoch, number_of_rooms:number_of_rooms,
                        services:services}

    var roomType = new RoomType(roomTypeDetail);

    roomType.save(function (err) {
        if (err) {
          cb(err, null)
	    console.log(roomType);
          return
        }
        console.log('New Room Type: ' + roomType);
        roomTypes.push(roomType)
        cb(null, roomType)
      }  );
}

function createRoomTypes(cb) {
    // hotel add
    listRooms[0]["hotel"] = hotels[0];
    listRooms[1]["hotel"] = hotels[0];
    listRooms[2]["hotel"] = hotels[0];
    listRooms[3]["hotel"] = hotels[0];
    listRooms[4]["hotel"] = hotels[1];
    listRooms[5]["hotel"] = hotels[1];
    listRooms[6]["hotel"] = hotels[1];
    listRooms[7]["hotel"] = hotels[2];
    listRooms[8]["hotel"] = hotels[2];
    listRooms[9]["hotel"] = hotels[2];
    var i = 0;
    var j = 0;
    for(i = 0; i < listRooms.length; i++){
        for(j = 0; j < listRoomTypeRoomService[i].length; j++){ 
            listRooms[i]["services"].push(roomServices[listRoomTypeRoomService[i][j]])
        }    
    }

    async.series(
        listOfRoomTypesToListOfCreateFunctions(listRooms),
        // optional callback
        cb);
}
// Pega numa lista de room types e converte para uma lista de funcoes para o async
function listOfRoomTypesToListOfCreateFunctions(roomTypeObjs) {
    // Pega numa lista de hotels e converte para uma lista de funcoes para o async
    var myRoomTypeCreateFunctions = roomTypeObjs.map(function(roomType) {
        return function(callback) {
            roomTypeCreate(roomType["hotel"], roomType["name"], roomType["price_high_epoch"], roomType["price_low_epoch"], 
                roomType["number_of_rooms"], roomType["services"], callback);
        }
    });
    return myRoomTypeCreateFunctions;
}

async.series([
    createHotels,
    createRoomServices,
    createRoomTypes
    
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    // All done, disconnect from database
    mongoose.connection.close();
});
