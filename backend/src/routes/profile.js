const express= require('express');
const profileRouter=express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const {validateEditData}= require('../utils/validation')
const {companyAuth} =  require('../middlewares/auth');
const TransportCompany = require('../models/transportCompany')

const uploadsDir = path.resolve(__dirname, "../../uploads/profile");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname || "").toLowerCase();
        cb(null, `${req.company._id}-${Date.now()}${extension}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Only image files are allowed."));
        }
        cb(null, true);
    }
});


profileRouter.get('/profile',companyAuth, async(req, res)=>{
    try{
        const company= await req.company;
        const safeCompany = company.toObject();
        delete safeCompany.password;
        res.send(safeCompany);
    }
    catch(err){
        res.status(400).send("There is some error"+ err);
    }
})

profileRouter.put('/profile/edit',companyAuth, async(req, res)=>{
   try { 
    validateEditData(req);
    const loggedInCompany= req.company;

    Object.keys(req.body).forEach((k)=>
        loggedInCompany[k]=req.body[k]
    )

    await loggedInCompany.save();
    const safeCompany = loggedInCompany.toObject();
    delete safeCompany.password;

    res.json({ message: "Company details updated successfully", data: safeCompany });
}
    catch(err){
        res.status(400).send("There is some error"+ err);
    }
})

profileRouter.post('/profile/upload-photo', companyAuth, upload.single("photo"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Please upload an image file." });
        }

        const photoUrl = `${req.protocol}://${req.get("host")}/uploads/profile/${req.file.filename}`;
        req.company.photoUrl = photoUrl;
        await req.company.save();

        const safeCompany = req.company.toObject();
        delete safeCompany.password;
        res.json({
            message: "Profile photo uploaded successfully.",
            data: safeCompany
        });
    } catch (err) {
        res.status(400).json({ message: err.message || "Photo upload failed." });
    }
});


//While calling it in frontend make sure to call logout just after this!
profileRouter.delete('/profile/delete', companyAuth, async(req, res)=>{
    try{
        console.log(req.company);
        const companyId= req.company._id;
        console.log(companyId);

        const deletedCompany = await TransportCompany.findByIdAndDelete(companyId);
        if(!deletedCompany) throw new Error("Company Not Found");

        res.cookie("token", null, {expires: new Date(Date.now())});

        res.send(deletedCompany + "deleted Succesfully and User logged Out");


    }
    catch(err){
        res.status(400).send("There is some error"+ err);
    }
})

profileRouter.use((err, _req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
    }
    if (err?.message === "Only image files are allowed.") {
        return res.status(400).json({ message: err.message });
    }
    return next(err);
});

module.exports=profileRouter;