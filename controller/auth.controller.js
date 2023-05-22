const UserRegistration = require('../model/user');
const OTP = require('../model/otp');
const Joi = require('joi');
const jwt = require("jsonwebtoken");
const secretKey = "secretkey";

const registrationSchema = Joi.object({
  username: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  dob: Joi.date().iso().required(),
  password: Joi.string().min(8).required(),
});

const signInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const changePasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const profileSchema = Joi.object({
  _id: Joi.string().required(),
  accountType: Joi.string().valid('personal', 'professional').required(),
});

const   setupPersonalAccountSchema = Joi.object({
  _id: Joi.string().required(),
  displayName: Joi.string().required(),
  personalTemplate: Joi.string().uri().required()
});

const setupProfessionalAccountSchema = Joi.object({
  _id: Joi.string().required(),
  businessLogo: Joi.string().required(),
  businessName: Joi.string().required(),
  businessType: Joi.string().required(),
  personalTemplate: Joi.string().required()
});

class  authController {
 
    //Register
      register = async (req, res) => {
  try {
    const { error } = registrationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const savedUser = await UserRegistration.findOne({ email: req.body.email });
    if (savedUser) {
      return res.status(401).json({ error: "user already exist with that email" });
    }

    const newData = new UserRegistration(req.body);
    await newData.save();
    res.json({ message: "saved successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
}
    //get all data
    userDetails=async(req,res) =>{
        try{
            const allData = await UserRegistration.find();
            return res.json(allData);  
           }
           catch(err){
            console.log(err.message);
           }
    }
    //signin
    // signIn=async(req, res)=> {
    //   try {
    //     const { error } = signInSchema.validate(req.body);
    //     if (error) {
    //       return res.status(400).json({ error: error.details[0].message });
    //     }
  
    //     const { email, password } = req.body;
    //     const user = await UserRegistration.findOne({ $or: [{ email }], password });
    //     if (!user) {
    //       return res.status(401).json({ message: 'user not found' });
    //     }
    //     jwt.sign({user}, secretKey, { expiresIn: '300s' }, (err, token) => {
    //       res.json({ token });
    //     });
    //   } catch(err) {
    //     console.log(err.message);
    //     res.status(500).send('Internal Server Error');
    //   }
    // }
    signIn = async (req, res) => {
      try {
        const { error } = signInSchema.validate(req.body);
        if (error) {
          return res.status(400).json({ error: error.details[0].message });
        }
    
        const { email, password } = req.body;
        const user = await UserRegistration.findOne({ $or: [{ email }], password });
        if (!user) {
          return res.status(401).json({ message: 'user not found' });
        }
        
        res.json({ message: 'Sign in successful' });
      } catch (err) {
        console.log(err.message);
        res.status(500).send('Internal Server Error');
      }
    }
    
  
      //change Password
      changePassword =async(req, res) => {
        try {
          const { error } = changePasswordSchema.validate(req.body);
          if (error) {
            return res.status(400).json({ error: error.details[0].message });
          }
    
          const { email, password } = req.body;
          const user = await UserRegistration.findOne({ email });
          if (!user) {
            return res.status(401).json({ message: 'Invalid email' });
          }
          user.password = password;
          await user.save();
          console.log(user.password);
          return res.json({ message: 'Password changed successfully' });
          
        } catch(err) {
          console.log(err.message);
          res.status(500).send('Internal Server Error');
        }
      }
      
      //user profile setup (personal or professional)
      profile = async (req, res) => {
        try {
          const { error } = profileSchema.validate(req.body);
          if (error) {
            return res.status(400).json({ message: error.details[0].message });
          }
          const { _id } = req.params;
          const { accountType } = req.body;
      
          const user = await UserRegistration.findById(_id);
          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
      
          if (accountType === 'personal' || accountType === 'professional') {
            user.accountType = accountType;
          } else {
            return res.status(400).json({ message: 'Invalid account type' });
          }
      
          await user.save();
          //console.log(user);
          return res.json({ message: 'Profile updated successfully' });
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: 'Internal server error' });
        }
      };
    
      
      //personal account setup
      setupPersonalAccount = async (req, res) => {
        try {
          const { error } = setupPersonalAccountSchema.validate(req.body);
          if (error) {
            return res.status(400).json({ message: error.details[0].message });
          }
      
          const { _id, displayName, personalTemplate } = req.body;
      
          const user = await UserRegistration.findOne({ _id });
      
          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
          if (user.accountType !== 'personal') {
            return res.status(403).json({ message: "Access denied" });
          }
          user.displayName = displayName;
          user.personalTemplate = personalTemplate;
      
          await user.save();
      
          return res.status(200).json({ message: 'Personal account set up successfully' });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Internal server error' });
        }
      }
     // professional account setup
      setupProfessionaAccount = async (req, res) => {
        try {
          const { error } = setupProfessionalAccountSchema.validate(req.body);
          if (error) {
            return res.status(400).json({ message: error.details[0].message });
          }
      
          const { _id, businessLogo, businessName, businessType, template } = req.body;
      
          const user = await UserRegistration.findOne({ _id });
      
          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
          if (user.accountType !== 'professional') {
            return res.status(403).json({ message: "Access denied" });
          }
          user.businessLogo = businessLogo;
          user.businessName = businessName;
          user.businessType = businessType;
          user.personalTemplate = template;
      
          await user.save();
      
          return res.status(200).json({ message: 'Professional account set up successfully' });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Internal server error' });
        }
      }
      
      //intrest list
      intrest = async (req, res) => {
        try {
          const keyword = req.query.search;
          let interests;
          if (keyword) {
            interests = await UserRegistration.find({
              interestName: { $elemMatch: { $regex: keyword, $options: 'i' } }
            }).select('interestName coverPic');
          } else {
            interests = await UserRegistration.find().select('interestName coverPic');
          }
      
          res.json(interests);
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: 'Server Error' });
        }
      }


      //choose intrest
      chooseIntrest = async (req, res) => {
        try {
          const { _id, interestName } = req.body;
      
          // Find the user by userId
          const user = await UserRegistration.findById(_id);
          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
      
          // Update the interest name
          user.interestName = interestName;
          await user.save();
      
          res.json({ message: 'Interest name updated successfully', user });
        } catch (error) {
          console.log(error);
          res.status(500).send('Internal Server Error');
        }
};

// emailSend = async (req, res) => {
//   let data = await UserRegistration.findOne({ email: req.body.email });
//   const responseType = {};
//   if(data){
//     let otpcode = Math.floor((Math.random() *10000)+1);
//     let otpData = new OTP({
//       email:req.body.email,
//       code:otpcode,
//       expiresIn: new Date().getTime()+300*1000

//     })
//     let otpResponse = await otpData.save();
//     responseType.statusText = 'Success'
//     responseType.message = 'please check your email id'
//   } else {
//     responseType.statusText = 'error'
//     responseType.message = 'email id not exist';
//   }
//   res.status(200).json(responseType);
// }

//mailer = 




}

module.exports = new authController();