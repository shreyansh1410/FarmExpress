const mongoose = require('mongoose')
const { Schema } = mongoose;
const MATERIAL_TYPES = [
    "Building Materials",
    "Automotive Parts and Vehicles",
    "Fresh Produce",
    "Food and Grocery Products",
    "Pharmaceutical and Medical Supplies",
    "Industrial Machinery and Equipment",
    "Chemicals (Non-Hazardous)",
    "Textiles and Apparel",
    "Electronics and Consumer Durables",
    "General Merchandise",
    "Other"
];

const routeSchema = new Schema({
    truckId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Truck'
    },

    source:{
        type: String, 
    },

    destination:{
        type: String,
    },
    materialType: {
        type: String,
        enum: MATERIAL_TYPES,
        default: "General Merchandise"
    },

    stops:{
        type:[String],
    },
    stopLoads: {
        type: [Number],
        default: []
    }
},
{
    timestamps:true
}
);

module.exports= mongoose.model('Route', routeSchema);
