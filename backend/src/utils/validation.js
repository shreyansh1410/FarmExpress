const validator=require('validator');
const INDIAN_HSRP_REGEX = /^[A-Z]{2}\d{1,2}[A-Z]{1,3}\d{4}$/;
const URL_VALIDATION_OPTIONS = {
    require_protocol: true,
    require_tld: false
};

const normalizeLicensePlate = (licensePlate = "") =>
    licensePlate.toString().trim().toUpperCase().replace(/\s+/g, "");

const isValidIndianHsrp = (licensePlate = "") =>
    INDIAN_HSRP_REGEX.test(normalizeLicensePlate(licensePlate));

const validateSignupData=(req)=>{
    const {name, emailId, password, confirmPassword}=req.body;

    if(!name){
        throw new Error("Invalid Name");
    }

    else if(!validator.isEmail(emailId)){
        throw new Error("Invalid EmailId");
    }

    else if(!validator.isStrongPassword(password)){
        throw new Error("Enter a Strong password");
    }

    else if(password !== confirmPassword){
        throw new Error("Password and Confirm Password do not match.");
    }
}

const validateEditData=(req)=>{
    const editableFields= ["name", "photoUrl", "address"];

    const isEditableField= Object.keys(req.body).every((k)=>editableFields.includes(k));

    if(!isEditableField){
        throw new Error("Edit Not Allowed");
    }

      if (req.body.photoUrl && !validator.isURL(req.body.photoUrl, URL_VALIDATION_OPTIONS)) {
        throw new Error("Enter a valid PhotoUrl");
      }
}

const validateTruckData=(req)=>{
    const {currentLoad, totalCapacity}=req.body;
    if(!currentLoad.every(load => load < totalCapacity)) {
        throw new Error("Current Load cannot exceed Capacity");
    }
}


module.exports={
    validateSignupData,
    validateEditData,
    validateTruckData,
    normalizeLicensePlate,
    isValidIndianHsrp
};