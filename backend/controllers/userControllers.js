const User = require("../models/User");
const {hashPassword, verifyPassword} = require('../utils/passwordHandle')
const generate_token = require('../utils/authMiddleware')
const jwt = require('jsonwebtoken')

exports.test = (req, res) => {
  res.status(200).json({
    "status":"success",
    'message': 'All ok done'
  })
}

exports.isEmailTaken = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (user) {
      res.status(400).json({
        status: "failed",
        message: "User already exists",
      });
    } else {
      res.status(200).json({
        status: "success",
        message: "New user",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  }
};


exports.isUsernameTaken = async (req, res) => {
  const {username} = req.body;
  
  try{
    console.log(username)
      const user = await User.findOne({
        userName: username
      })
      if(user){
        res.status(400).json({
          status: "failed",
          message: "User already exist"
        })
      }else {
        res.status(200).json({
          status: "success",
          message: "new user"
        })
      }
  }catch(err){
    res.status(500).json({
      status: "failed",
      message: `internal server error: ${err}`
    })
  }
};

exports.registerUser = async (req, res) => {
  const { userName, email, password, profilePicture } = req.body;
  const hashedPassword = await hashPassword(password)

  try{
    const user = User.create({
      userName,
      email,
      password : hashedPassword,
      profilePicture,
    });
    res.status(201).json({
      status: "success",
      message: `user ${userName} is created successfully`,
    });
  }catch(err){
    res.status(400).json({
      status: "failed",
      message: `Error while registering user`,
    });
  }

};


exports.login = async (req, res) => {
  const { userName, password, email } = req.body;

  try {
    const query = email ? { email } : { userName };

    const user = await User.findOne(query);

    if (user) {
      const passwordVerification = verifyPassword(password, user.password);
      
      if (passwordVerification) {
        const token = generate_token(user)
        return res.status(200).json({
          status: 'success',
          message: 'Login successful',
          token: token
        });
      } else {
        return res.status(400).json({
          status: 'failed',
          message: 'Username or password incorrect'
        });
      }
    } else {
      return res.status(400).json({
        status: 'failed',
        message: 'Username or password incorrect'
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: 'failed',
      message: `Internal server error: ${err.message}`
    });
  }
};


exports.token_authentication = (req, res) => {
  const { token } = req.body

  if(!token){
      res.status(400).json({
          status: 'failed',
          message: "Please login again"
      })
  }

  try{
     jwt.verify(token, process.env.JWT_SECRET, (err, user) =>{
      if(err){
          res.status(400).json({
              status: 'failed',
              message: 'invalid token'
          })
      }
      res.status(200).json({
          status: "success",
          message: "token successfully authenticated"
      })
     })
  }catch(err){
      res.status(500).json({
          status: "failed",
          message: `Internal server error ${err}`
      })
  }
}