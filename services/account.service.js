const bcrypt = require('bcrypt');
const randtoken = require('rand-token');

const User = require('../models/User.model');
const { accountHelpers } = require('../helpers');
const { InsecurePassword, InvalidReferral, EmailAlreadyExists, InvalidCredentials, UserNotFound, InvalidToken } = require('../Errors');

/**
 * Register a new user. Note, this function does not validate
 * the presence of firstName, lastName, and email
 * @param  {Object}  userObject User object without salted password
 * @return {Object}             New User document
 */
exports.registerUser = async (userObject, referralCode, bypassReferral = false) => {

  const passwordErrors = accountHelpers.validatePassword(userObject.password);

  if(passwordErrors.length){
    throw new InsecurePassword(passwordErrors);
  }

  // init meta object with defaults
  userObject.meta = {
    referredBy: null,
    tokens: {},
  };

  // OPTIMIZE: run referall check and password hash in parallel
  // verify ref code
  if(!bypassReferral){
    const referral = await User.findReferral(referralCode);
    if(!referral){
      throw new InvalidReferral(referralCode);
    }
    // set refferredBy meta
    userObject.meta.refferredBy = referral.id;
  }else{
    // if nobody referred set to null
    userObject.meta.refferredBy = null;
  }

  // store user
  const newUser = new User(userObject);
  let user = null;
  try{
    user = await newUser.save();
  } catch(error) {
    // handle duplicate email error
    if(error.code === 11000){
      throw new EmailAlreadyExists(`User with email "${newUser.email}" already exists.`);
    }
    throw error;
  }

  return user;

}

exports.authenticateUser = async (email, rawPassword) => {

  const user = await User.findOne({email});

  if(!user){
    throw new InvalidCredentials(`User with email: ${email} does not exist`);
  }

  if(bcrypt.compare(rawPassword, user.password) == false){
    throw new InvalidCredentials(`Incorrect password for user with email ${email}`);
  }

  return user;

}

exports.setForgotPasswordToken = async email => {

  const user = await User.findOne({email});

  if(!user){
    throw new InvalidCredentials(`User with email: ${email} does not exist`);
  }

  // generate and attach token to user meta object
  const token = randtoken.generate(16);

  user.meta.tokens.passwordReset = token;
  user.markModified('meta');

  await user.save();

  return user.meta.tokens.passwordReset;

}

exports.resetPassword = async (userId, token, password) => {

  const user = await User.findById(userId);

  if(!user){
    throw new UserNotFound(`User with id ${userId} not found`);
  }

  // OPTIMIZE: token not set and token not found
  // should be seperated to provide better errors
  // and more details if someone tried to reset a password
  // on someones account

  // verify token
  if(!user.meta.tokens.passwordReset || user.meta.tokens.passwordReset !== token){
    throw new InvalidToken(`Token ${token} not found`);
  }

  // check new password meets requirements
  const passwordErrors = accountHelpers.validatePassword(password);

  if(passwordErrors.length){
    throw new InsecurePassword(passwordErrors);
  }

  // set new password
  user.password = password;

  // clear token
  delete user.meta.tokens.resetPassword;
  user.markModified('meta');

  await user.save();

  return user;

};
