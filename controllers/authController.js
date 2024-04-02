const users = require('../model/User')
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const dotenv=require('dotenv');
const Customer = require('../model/Customer');
// const read=require('../read')
dotenv.config();
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
})


const signUp = async (req, res) => {
  const { name, email, password,phone } = req.body;

  // Confirm data
  if (!email || !password || !name || !phone) {
    return res.status(400).json({ message: 'All fields are required' });
  }


  // Check for duplicates


  const duplicate = await users.findOne({ email }).lean().exec();

  console.log(duplicate);
  if (duplicate) {
    return res.status(409).json({ message: 'Email Already Exists!!' });
  }

  // Hash password
  const hashPwd = await bcrypt.hash(password, 10); // Salt rounds
  const OTP = Math.floor(100000 + Math.random() * 900000);

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "6 Digit code to verify your email Address from VenQ",
    text: `OTP: ${OTP}`,
  }


  transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
      return res.status(400).json({ message: "Email not sent!!!" });
    } else {
      // Store OTP and its expiration time in the user document
      const expirationTime = new Date().getTime() + 3 * 60 * 1000; // 3 minutes
      const userObject = {
        name,
        password: hashPwd,
        email,
        otp: { code: OTP, expiresAt: expirationTime },
        phone
      };
      // console.log("unique")
      // Create and store new user
      const user = await users.create(userObject);
      const accessToken = jwt.sign(
        {
          UserInfo: {
            email,
            name,
            phone
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1h' }
      );


      if (user) {
        return res
          .status(201)
          .json({ message: user, token: accessToken });
      } else {
        return res
          .status(400)
          .json({ message: 'Invalid user data received' });
      }
    }
  });
}


const verifyEmail = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Please provide both email and OTP.' });
  }

  try {
    const existingUser = await users.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({ message: 'User does not exist.' });
    }

    const { code, expiresAt } = existingUser.otp;

    if (code !== otp) {
      return res.status(400).json({ message: 'Incorrect OTP.' });
    }

    if (Date.now() > expiresAt) {
      await users.updateOne(
        { email },
        { $set: { otp: { code: null, expiresAt: null } } }
      );
      return res.status(400).json({ message: 'OTP has expired.' });
    }

    await users.updateOne(
      { email },
      { $set: { isVerified: true, otp: { code: null, expiresAt: null } } }
    );

    return res.status(200).json({ message: 'Account verified successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
}


const resendOTP = async (req, res) => {
  const { email } = req.body;

  try {

    // Generate a new OTP
    const newOTP = Math.floor(100000 + Math.random() * 900000);

    // Update the existing user document with the new OTP and expiration time
    const expirationTime = new Date().getTime() + 3 * 60 * 1000; // 3 minutes
    const updatedUser = await users.findOneAndUpdate(
      { email },
      { $set: { otp: { code: newOTP, expiresAt: expirationTime } } }
    );

    if (!updatedUser) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Send the new OTP to the user's email address
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "New 6 Digit code to verify your email Address from VenQ",
      text: `New OTP: ${newOTP}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(400).json({ message: "Email not sent!!!" });
      }
      return res.status(200).json({ message: 'OTP resent successfully!' });
    });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
}


const signOut = async (req, res) => {
  const { token } = req.body;
  // console.log(token);

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decodedToken = jwt.decode(token, process.env.ACCESS_TOKEN_SECRET);
    const email = decodedToken.UserInfo.email;

    const updatedUser = await users.updateOne(
      { email },
      { $set: { isLoggedIn: false } }
    );
    // console.log(updatedUser);
    res.json({ message: 'Successfully logged out' });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
}


const login = async (req, res) => {
  const { email, password } = req.body
  // console.log(email);
  // console.log(password);
  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' })
  }
  const foundUser = await users.findOne({ email }).exec();
  // console.log(foundUser);
    if (!foundUser || !foundUser.isVerified) {
    return res.status(401).json({ message: 'User not found or user is not verified' })
  }
  const match = await bcrypt.compare(password, foundUser.password)
  if (!match) return res.status(401).json({ message: 'Please enter correct password' })

  const accessToken = jwt.sign(
    {
      "UserInfo": {
        "email": foundUser.email,
        "name": foundUser.name,
        "phone":foundUser.phone,
        "id":foundUser.id,
        "isAdmin":foundUser.isAdmin,
        "isLoggedIn":foundUser.isLoggedIn,
      }
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '6h' }
  )
  // console.log(accessToken);

  const updatedUser = await users.updateOne(
    { email },
    { $set: { isLoggedIn: true } }
  );

  // send accesstoken containing username and roles
  res.json({ token: accessToken, message: 'Login Successful' })
}


const checkverified=async(req,res)=>{
  const user=req.params.id;
  try {
    const result=await Customer.findOne({email:user});
    console.log(result);
    const st=result.isVerified;
  if(result){
      res.status(200).send({
        success:true,
        isVerified:st
      })
  }else{
    res.status(400).send({
      success:false,
      isVerified:undefined
    })
  }
  } catch (error) {
    console.log(error);
  }
}

// const googlesheetmethod=async(req,res)=>{
//   try{
//      read.main();
    
//     res.status(200).json({ message: 'Users populated in the Google Sheet' });
  
//   }catch(err){
//     res.status(500).json({err:"Internal Server Error"});
//   }

//   };

const updateverified=async(req,res)=>{
  const user=req.params.id;
  try {
    const result=await Customer.updateOne(
      { email:user },
      { $set: { isVerified: req.body.newstatus} }
    );
  if(result){
      res.status(200).send({
        success:true,
      })
  }else{
    res.status(400).send({
      success:false
    })
  }
  } catch (error) {
    console.log(error);
  }
}

const getpendingkyc=async(req,res)=>{
  try {
    const result=await Customer.find();
    if(result){
      res.status(200).send({
        success:true,
        data:result
      })
    }else{
      res.status(200).send({
        success:false,
        data:[]
      })
    }
  } catch (error) {
    console.log(error);
  }
}

const getallusers=async(req,res)=>{
  try {
    const result=await Customer.find();
    return res.json(result);
  } catch (error) {
    console.log(error);
  }
}


const verifyAdmin = async (req, res) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  // console.log("unique ",authHeader);

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized',isAdmin:false});
    
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Forbidden',isAdmin:false});

      req.user = decoded.UserInfo.name;
      req.email = decoded.UserInfo.email;
      req.isAdmin = decoded.UserInfo.isAdmin;

    
    })
    if(req.isAdmin) {
      return res.status(200).json({isAdmin:true});
    }
    else{
      return res.status(403).json({isAdmin:false});
      
    }
}

const checkLogin = async (req, res) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  // console.log(authHeader);
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized', isLoggedIn: false });
  }
  
  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden', isLoggedIn: false });
    }

    req.user = decoded.UserInfo.name;
    req.email = decoded.UserInfo.email;
    req.isLoggedIn = decoded.UserInfo.isLoggedIn;

    // Check the isLoggedIn flag and send the response accordingly
    if (req.isLoggedIn) {
      return res.status(200).json({ isLoggedIn: true });
    } else {
      return res.status(403).json({ isLoggedIn: false });
    }
  });
};


module.exports = { signUp, verifyEmail, login, signOut, resendOTP,verifyAdmin,checkLogin ,checkverified,updateverified,getpendingkyc,getallusers}