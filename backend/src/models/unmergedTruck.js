const mongoose = require('mongoose');
const { Schema } = mongoose;

const unmergedTruckSchema = new Schema({
    licensePlate:{ 
        type: String,
        required: true,
        unique:true,
    },

    totalCapacity:{
        type: Number,
    },
    currentLoad:{
        type: [Number],
        default: [] 
    },

    remainingLoad:{
        type:[Number],
        default: [] 
    }


});

module.exports= mongoose.model('UnmergedTruck', unmergedTruckSchema);
