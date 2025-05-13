const bcrypt = require('bcrypt');
const jwt =require("jsonwebtoken")

const User = require('../models/user_models');

async function schoolregister(req, res) {
    try {
      const data = req.body;
      const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS));
      data["password"] = await bcrypt.hash(data.password, salt);
      const result = await User.createSchool(data);
      res.status(201).send(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
}

async function donorregister(req, res) {
    try {
      const data = req.body;
      const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS));
      data["password"] = await bcrypt.hash(data.password, salt);
      const result = await User.createDonor(data);
      res.status(201).send(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
}


async function schoollogin (req, res) {
    const data = req.body;
    try {
        const user = await User.getOneSchoolByUsername(data.school_name)
        if (!user) { throw new Error("No school with this username")}
        const match = await bcrypt.compare(data.password, user.password)

        if (match) {
           
            const payload = { 
                school_id: user.school_id,
                school_name: user.school_name
            }
          
            const sendToken = (err, token) => {
                if (err) {
                    throw new Error("Error in token generation")
                } res.status(200).json ({ 
                    success: true,
                    token: token
                })
            }
            jwt.sign(payload, process.env.SECRET_TOKEN, { expiresIn: 3600 }, sendToken)
        } else {
            throw new Error("School could not be authenticated.")
        }
    } catch(err){
        res.status(401).json({ error: err.message })
    }
    res.status(200).send(data);
}

async function donorlogin (req, res) {
    const data = req.body;
    try {
        const user = await User.getOneDonorByUsername(data.donor_name)
        if (!user) { throw new Error("No donor with this username")}
        const match = await bcrypt.compare(data.password, user.password)

        if (match) {
           
            const payload = { 
                donor_id: user.donor_id,
                donor_name: user.donor_name
            }
          
            const sendToken = (err, token) => {
                if (err) {
                    throw new Error("Error in token generation")
                } res.status(200).json ({ 
                    success: true,
                    token: token
                })
            }
            jwt.sign(payload, process.env.SECRET_TOKEN, { expiresIn: 3600 }, sendToken)
        } else {
            throw new Error("Donor could not be authenticated.")
        }
    } catch(err){
        res.status(401).json({ error: err.message })
    }
    res.status(200).send(data);
}


module.exports = {
    schoolregister, donorregister, schoollogin, donorlogin
}                           