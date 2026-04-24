const express= require('express');
const authRouter= express.Router();
const {validateSignupData}=require('../utils/validation')
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const TransportCompany= require('../models/transportCompany');
const mongoose = require('mongoose');

const sanitizeCompany = (companyDoc) => {
  const safeCompany = companyDoc.toObject();
  delete safeCompany.password;
  return safeCompany;
};

const generateRegistrationNumber = () =>
  `CMP${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

const getUniqueRegistrationNumber = async () => {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const candidate = generateRegistrationNumber();
    const existingCompany = await TransportCompany.exists({ registrationNumber: candidate });
    if (!existingCompany) return candidate;
  }
  throw new Error("Could not generate a unique registration number. Please retry.");
};

authRouter.post('/signup', async (req, res)=>{
    try{
      validateSignupData(req);
      const {name, emailId, password}= req.body;
      const registrationNumber = await getUniqueRegistrationNumber();
  
      const Hashpassword= await bcrypt.hash(password, 10)
  
      const company= new TransportCompany({
          name, emailId, password:Hashpassword, registrationNumber
      });
      
      await company.save();
      const token= await company.getJWT();
 
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,  
        sameSite: "none",  
      });
      
      res.status(201).json({
        message: "Account created successfully.",
        data: sanitizeCompany(company)
      });
     } 
  
     catch(err){
      if (err?.code === 11000 && err?.keyPattern?.emailId) {
        return res.status(409).json({ message: "Email ID already in use." });
      }
      if (err?.code === 11000 && err?.keyPattern?.registrationNumber) {
        return res.status(503).json({ message: "Could not allocate company registration number. Please retry." });
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ message: err.message || "Signup validation failed." });
      }
      res.status(400).json({ message: err.message || "Signup failed. Please check your details." });
     }
  })

  authRouter.post('/login', async(req, res)=>{
    try{
        const { emailId, password } = req.body;
        const email = emailId?.toString().trim().toLowerCase();
        const passwordInput = password?.toString() || "";
        if (!email || !passwordInput) {
            return res.status(400).json({ message: "Email ID and password are required." });
        }
        const company= await TransportCompany.findOne({ emailId: email });

        if(!company){
            return res.status(401).json({ message: "Invalid email or password." });
        }
        const isPasswordValid= await company.validatePassword(passwordInput);

        if(!isPasswordValid){
            return res.status(401).json({ message: "Invalid email or password." });
        }
        const token= await company.getJWT();

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,  
            sameSite: "none",  
          });
          
        res.json({
          message: "Login successful.",
          data: sanitizeCompany(company)
        });
    }
    catch(err){
        console.error("Login error:", err);
        res.status(500).json({ message: "Unable to login right now. Please try again." });
    }
})

authRouter.post('/logout', async(req, res)=>{
    res.cookie("token", null, {expires: new Date(Date.now())});
    res.json({ message: "Logged out successfully." });
})


module.exports= authRouter;