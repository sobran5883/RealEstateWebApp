import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';                               //package for hash passwords
import {errorHandler} from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup =async (req, res, next)=>{
    const {username, email, password} = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);    //here 10 acting as a salt.
    const newUser = new User({username, email, password: hashedPassword});
    try{                                                       //error tracking.
      await newUser.save()                                     //if error or duplicate information, this we send this will send back the error to users.
      res.status(201).json("User created successfully")        //best practice is middleware and a function are used to handle the error.
    }catch(error){                                             //so we create middleware inside index.js.
      // res.status(500).json(error.message);
      next(error);
      // next(errorHandler(550, 'error from the function'));   //Manual error created by us.
    }

}

export const signin = async (req, res, next)=>{                //here we getting data from req.body.
  const {email, password}= req.body;
  try{
    const validUser = await User.findOne({email});             //checking email which stored in db and using await because it takes some time.
    if(!validUser) return next(errorHandler(404, 'User not found!'));  //this is custom error that we created in utils used when usernot found.
    const validPassword = bcryptjs.compareSync(password, validUser.password);  //matching hashed password of validuser.
    if(!validPassword) return next(errorHandler(401, 'Wrong credentials!'));
    // const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);   //storing a cookie inside the browser in form of a hash token that include the email and ID of user .
    const token = jwt.sign({ id: validUser._id },'jfdaklfjaljf3598248959');   //storing a cookie inside the browser in form of a hash token that include the email and ID of user .
    const {password: pass, ...rest} = validUser._doc;          //we want to remove the password before sending back the user.
    res.cookie('access_token', token, {httpOnly: true }).status(200).json(rest);   //saveing upper token as the cookie .

  }catch(error){
    next(error);          //catching error using middleware that we created in index.js
  }
}


export const google = async (req, res, next) => {
  try{
    const user = await User.findOne({email: req.body.email})
    if(user){
      const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
      const {password: pass, ...rest} = user._doc;
      res.cookie('access_token', token, {httpOnly: true}).status(200).json(rest);
    }else{
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4) , email: req.body.email, password:hashedPassword, avatar: req.body.photo});
      await newUser.save();
      const { password: pass, ...rest} = newUser._doc;
      res.cookie('access_token', token, {httpOnly: true}).status(200).json(rest);
    }
  }catch(error){
    next(error)
  }
}


export const signOut = async (req, res, next) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json('User has been logged out!');
  } catch (error) {
    next(error);
  }
};