const mongoose = require('mongoose');
const { Schema } = mongoose;
const { isValidIndianHsrp, normalizeLicensePlate } = require('../utils/validation');
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

const truckSchema = new Schema({
    licensePlate:{ 
        type: String,
        required: true,
        unique:true,
        set: normalizeLicensePlate,
        validate(value) {
            if (!isValidIndianHsrp(value)) {
                throw new Error("License plate must follow Indian HSRP format (e.g. UP11AA1111, DL1CX9999)");
            }
        }
    },

    companyId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Company'
    },

    totalCapacity:{
        type: Number,
    },
    materialType: {
        type: String,
        enum: MATERIAL_TYPES,
        default: "General Merchandise"
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

module.exports= mongoose.model('Truck', truckSchema);
