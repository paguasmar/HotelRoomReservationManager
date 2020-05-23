var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var RoomServiceSchema = new Schema({
    name: {type: String ,required:true}
    
});

// Export model.
module.exports = mongoose.model('RoomService', RoomServiceSchema);